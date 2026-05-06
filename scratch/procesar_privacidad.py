import csv
import re
import os

def normalize_name(name):
    if not name: return ""
    name = name.upper().strip()
    replacements = {
        'Á': 'A', 'À': 'A', 'Ä': 'A', 'Â': 'A',
        'É': 'E', 'È': 'E', 'Ë': 'E', 'Ê': 'E',
        'Í': 'I', 'Ì': 'I', 'Ï': 'I', 'Î': 'I',
        'Ó': 'O', 'Ò': 'O', 'Ö': 'O', 'Ô': 'O',
        'Ú': 'U', 'Ù': 'U', 'Ü': 'U', 'Û': 'U',
        'Ñ': 'N', 'Y': 'I',
        '\x91': 'N',
        '\x93': 'O',
        '\x8d': 'I',
        '\x89': 'E',
        '\xda': 'U'
    }
    for k, v in replacements.items():
        name = name.replace(k, v)
    
    # Aggressive cleaning of non-ASCII
    name = "".join(c for c in name if ord(c) < 128)
    
    return " ".join(name.split())

def match_names(short_name, full_names_map):
    norm_short = normalize_name(short_name)
    if not norm_short or len(norm_short) < 3: return None
    
    if norm_short in full_names_map:
        return full_names_map[norm_short]
            
    words = norm_short.split()
    for norm_fn, original_fn in full_names_map.items():
        if all(word in norm_fn for word in words):
            return original_fn
            
    for norm_fn, original_fn in full_names_map.items():
        if norm_short in norm_fn:
            return original_fn

    return None

def process_assignments():
    # 1. Load Planta Personal
    planta = {} 
    full_names_map = {} 
    
    planta_path = r"g:\Otros ordenadores\Asus\Desktop\Evaluandonos\PLANTA PERSONAL 2026 ACTUALIZADA 14 DE ENERO DE 2026.csv"
    current_sede = "Central"
    
    with open(planta_path, mode='r', encoding='latin-1') as f:
        reader = csv.reader(f, delimiter=';')
        for row in reader:
            if not row: continue
            line_str = ";".join(row).upper()
            
            if "SEDE PRINCIPAL" in line_str: current_sede = "Central"
            elif "SEDE SENDERO" in line_str: current_sede = "Yanaconas"
            elif "SEDE PUEBLILLO" in line_str: current_sede = "Pueblillo"
            elif "SEDE PISOJE BAJO" in line_str: current_sede = "Pisoje Bajo"

            if len(row) >= 3:
                name = row[1].strip()
                id_val = row[2].strip()
                if name and id_val.isdigit():
                    planta[name] = {"id": id_val, "sede": current_sede}
                    full_names_map[normalize_name(name)] = name

    # 2. Load Users
    users_in_app = {} 
    users_path = r"g:\Otros ordenadores\Asus\Desktop\Evaluandonos\usuarios-evaluandonos.csv"
    with open(users_path, mode='r', encoding='latin-1') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) >= 3:
                name = row[2].strip()
                if name and name != "nombre":
                    users_in_app[normalize_name(name)] = name

    # Add users to full_names_map if not there (some users might not be in Planta)
    for norm_name, original_name in users_in_app.items():
        if norm_name not in full_names_map:
            full_names_map[norm_name] = original_name

    # 3. Process Nueva Asignacion
    assignments = [] 
    asig_path = r"g:\Otros ordenadores\Asus\Desktop\Evaluandonos\NUEVA ASIGNACIÓN 2026 .csv"
    
    grade_cols = {
        5: "0", 6: "1", 7: "2", 8: "3", 9: "4", 10: "5",
        11: "601", 12: "602", 13: "603",
        14: "701", 15: "702", 16: "703",
        17: "801", 18: "802",
        19: "901", 20: "902", 21: "903",
        22: "1001", 23: "1002", 24: "1003",
        25: "1101", 26: "1102", 27: "1103"
    }

    current_teacher_full = None
    with open(asig_path, mode='r', encoding='latin-1') as f:
        reader = csv.reader(f, delimiter=';')
        rows = list(reader)
        for i in range(2, len(rows)):
            row = rows[i]
            if not row or len(row) < 3: continue
            
            # Detect section change to stop processing subjects
            if "DIRECTORES DE GRUPO" in ";".join(row).upper():
                break
            
            teacher_short = row[2].strip()
            if teacher_short and teacher_short.upper() not in ["DOCENTE", "#"]:
                matched = match_names(teacher_short, full_names_map)
                if matched:
                    current_teacher_full = matched
                    # print(f"DEBUG: Row {i} matched '{teacher_short}' to '{matched}'")
                else:
                    # If we found a string in teacher column but no match, reset current teacher
                    # to avoid assigning the next subjects to the previous teacher.
                    current_teacher_full = None

            if current_teacher_full and len(row) >= 5:
                subject = row[4].strip()
                if subject and subject.upper() not in ["AREA", "TOTAL", "DIFERENCIA"]:
                    for col_idx, grade_name in grade_cols.items():
                        if col_idx < len(row):
                            val = row[col_idx].strip()
                            if val and val != "0" and val.isdigit():
                                assignments.append((current_teacher_full, "ASIGNACION", grade_name, subject, ""))

    # 4. Final Output Construction
    final_output = []
    assigned_users_norm = set()
    
    for asig in assignments:
        norm_name = normalize_name(asig[0])
        if norm_name in users_in_app:
            final_output.append(asig)
            assigned_users_norm.add(norm_name)

    for norm_name, original_name in users_in_app.items():
        if norm_name not in assigned_users_norm:
            sede_info = planta.get(original_name, {})
            sede = sede_info.get("sede", "Central")
            final_output.append((original_name, "SEDE", "", "", sede))

    # 6. Save
    output_path = r"g:\Otros ordenadores\Asus\Desktop\Evaluandonos\privacidad_docentes.csv"
    
    # Subject Mapping
    subject_map = {
        "CIE. NATURALES": "BIOLOGIA",
        "CIEN NATURALES": "BIOLOGIA",
        "CIENCIAS NATURALES": "BIOLOGIA",
        "E FISICA": "EDUCACION FISICA",
        "EDUCACIÓN FÍSICA": "EDUCACION FISICA",
        "EDUCACION FISICA": "EDUCACION FISICA",
        "ÉTICA": "ETICA",
        "CATEDRA DE PAZ": "CATEDRA PAZ",
        "LECTO ESCRITURA": "LECTOESCRITURA",
        "LECTOESCITURA": "LECTOESCRITURA",
        "RELIGIÓN": "RELIGION",
        "ESPAÑOL": "ESPANOL",
        "FISICA": "FISICA",
        "QUIMICA": "QUIMICA"
    }

    with open(output_path, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["nombre", "tipo", "grado", "asignatura", "sede"])
        for row in final_output:
            subj = row[3].upper().strip()
            
            # Clean and normalize
            subj_norm = normalize_name(subj)
            
            # Application of Logic for Supabase
            if "NATURALES" in subj_norm: 
                subj = "BIOLOGIA"
            elif "FISICA" in subj_norm and "EDUC" not in subj_norm: 
                subj = "FISICA"
            elif "QUIMICA" in subj_norm: 
                subj = "QUIMICA"
            elif "ESPANOL" in subj_norm or "ESPA" in subj_norm: 
                subj = "ESPANOL"
            elif "ETICA" in subj_norm: 
                subj = "ETICA"
            elif "RELIGION" in subj_norm: 
                subj = "RELIGION"
            elif "LECTO" in subj_norm: 
                subj = "LECTOESCRITURA"
            elif "SOCIALES" in subj_norm:
                subj = "SOCIALES"
            elif "INGLES" in subj_norm:
                subj = "INGLES"
            elif "EDUCACION FISICA" in subj_norm or "E FISICA" in subj_norm:
                subj = "EDUCACION FISICA"
            else:
                subj = subj_norm
            
            final_row = list(row)
            final_row[3] = subj
            writer.writerow(final_row)

    print(f"Done! Records: {len(final_output)}")
    print(f"Assigned: {len(assigned_users_norm)}")
    print(f"Sede only: {len(users_in_app) - len(assigned_users_norm)}")

if __name__ == "__main__":
    process_assignments()
