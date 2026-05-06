import csv
import unicodedata
import os

# --- Helper functions ---
def normalize_name(name):
    if not name: return ""
    # Convert to string, upper and strip
    n = str(name).upper().strip()
    # Normalize unicode to decompose accents
    n = "".join(c for c in unicodedata.normalize('NFD', n) if unicodedata.category(c) != 'Mn')
    # Standardize common characters
    n = n.replace('Ñ', 'N')
    n = n.replace('Y', 'I')
    # Keep only alphanumeric and spaces
    n = "".join(c for c in n if c.isalnum() or c.isspace())
    return " ".join(n.split())

def match_teacher(short_name, full_names_map):
    norm_short = normalize_name(short_name)
    if not norm_short or len(norm_short) < 3: return None
    
    # 1. Exact match
    if norm_short in full_names_map:
        return full_names_map[norm_short]
            
    # 2. Word subset match (all words in short_name must be in full_name)
    words = norm_short.split()
    for norm_fn, original_fn in full_names_map.items():
        if all(word in norm_fn for word in words):
            return original_fn
            
    # 3. Substring match
    for norm_fn, original_fn in full_names_map.items():
        if norm_short in norm_fn:
            return original_fn

    return None

def process():
    # Paths
    path_planta = r"g:\Otros ordenadores\Asus\Desktop\Evaluandonos\PLANTA PERSONAL 2026.csv"
    path_usuarios = r"g:\Otros ordenadores\Asus\Desktop\Evaluandonos\usuarios-evaluandonos.csv"
    path_asig = r"g:\Otros ordenadores\Asus\Desktop\Evaluandonos\NUEVA ASIGNACIÓN 2026 .csv"
    path_output = r"g:\Otros ordenadores\Asus\Desktop\Evaluandonos\privacidad_docentes.csv"

    # 1. Load Planta Personal for Sede and Full Names
    # planta_info: original_full_name -> {id, sede}
    # full_names_map: norm_full -> original_full
    planta_info = {}
    full_names_map = {}
    
    current_sede = "Central"
    # PLANTA is latin-1
    with open(path_planta, mode='r', encoding='latin-1') as f:
        reader = csv.reader(f, delimiter=';')
        for row in reader:
            if not row: continue
            line = ";".join(row).upper()
            if "SEDE PRINCIPAL" in line: current_sede = "Central"
            elif "SEDE SENDERO" in line or "SENDERO" in line: current_sede = "Yanaconas"
            elif "SEDE PUEBLILLO" in line: current_sede = "Pueblillo"
            elif "SEDE PISOJE BAJO" in line: current_sede = "Pisoje Bajo"
            
            if len(row) >= 3 and row[2].strip().isdigit():
                name = row[1].strip()
                id_val = row[2].strip()
                planta_info[name] = {"id": id_val, "sede": current_sede}
                full_names_map[normalize_name(name)] = name

    # 2. Load App Users (Source of truth for who gets a record)
    # app_users: List of original full names from app
    app_users = []
    with open(path_usuarios, mode='r', encoding='latin-1') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) >= 3 and row[2].strip().lower() != "nombre":
                name = row[2].strip()
                app_users.append(name)
                # Ensure they are in our map even if not in Planta
                norm = normalize_name(name)
                if norm not in full_names_map:
                    full_names_map[norm] = name
                    if name not in planta_info:
                        planta_info[name] = {"id": "", "sede": "Central"}

    # 3. Process Assignments from NUEVA ASIGNACIÓN
    # NUEVA ASIGNACIÓN is UTF-8 with BOM
    assignments = []
    grade_cols = {
        5: "0", 6: "1", 7: "2", 8: "3", 9: "4", 10: "5",
        11: "601", 12: "602", 13: "603",
        14: "701", 15: "702", 16: "703",
        17: "801", 18: "802",
        19: "901", 20: "902", 21: "903",
        22: "1001", 23: "1002", 24: "1003",
        25: "1101", 26: "1102", 27: "1103"
    }

    def clean_subject(s):
        n = normalize_name(s)
        if not n: return ""
        # Specific mappings for Supabase compatibility
        if "NATURALES" in n: return "BIOLOGIA"
        if "FISICA" in n and "EDUC" not in n: return "FISICA"
        if "QUIMICA" in n or "QUMICA" in n: return "QUIMICA"
        if "ESPANOL" in n or "ESPA" in n: return "ESPANOL"
        if "ETICA" in n: return "ETICA"
        if "RELIGION" in n: return "RELIGION"
        if "LECTO" in n: return "LECTOESCRITURA"
        if "SOCIALES" in n: return "SOCIALES"
        if "INGLES" in n: return "INGLES"
        if "EDUCACION FISICA" in n or "E FISICA" in n: return "EDUCACION FISICA"
        return n

    current_teacher = None
    with open(path_asig, mode='r', encoding='utf-8-sig') as f:
        reader = csv.reader(f, delimiter=';')
        rows = list(reader)
        for i in range(2, len(rows)):
            row = rows[i]
            if not row or len(row) < 5: continue
            if "DIRECTORES DE GRUPO" in ";".join(row).upper(): break
            
            # Check for teacher name in column 2
            teacher_cell = row[2].strip()
            if teacher_cell and teacher_cell.upper() not in ["DOCENTE", "#", "AREA"]:
                match = match_teacher(teacher_cell, full_names_map)
                if match:
                    current_teacher = match
                else:
                    current_teacher = None
            
            if current_teacher:
                subject = row[4].strip()
                if subject and subject.upper() not in ["AREA", "TOTAL", "DIFERENCIA"]:
                    s_final = clean_subject(subject)
                    sede = planta_info.get(current_teacher, {}).get("sede", "Central")
                    for col, grade in grade_cols.items():
                        if col < len(row):
                            val = row[col].strip()
                            if val and val != "0" and val.isdigit():
                                assignments.append((current_teacher, "ASIGNACION", grade, s_final, sede))

    # 4. Filter and Finalize
    final_rows = []
    assigned_norm = set()
    
    # Filter assignments to only include app users
    app_users_norm = {normalize_name(u): u for u in app_users}
    for asig in assignments:
        norm = normalize_name(asig[0])
        if norm in app_users_norm:
            # Use the original name from app_users for consistency
            original_name = app_users_norm[norm]
            final_rows.append((original_name, asig[1], asig[2], asig[3], asig[4]))
            assigned_norm.add(norm)
    
    # Add Sede-only records for app users without subjects
    for norm, original_name in app_users_norm.items():
        if norm not in assigned_norm:
            sede = planta_info.get(original_name, {}).get("sede", "Central")
            final_rows.append((original_name, "SEDE", "", "", sede))

    # 5. Save to CSV
    with open(path_output, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        # Headers are required for Supabase import mapping
        writer.writerow(["nombre", "tipo", "grado", "asignatura", "sede"])
        for r in final_rows:
            writer.writerow(r)

    print(f"Processed successfully.")
    print(f"Total CSV rows: {len(final_rows)}")
    print(f"Matched users with assignments: {len(assigned_norm)}")
    print(f"Users with Sede only: {len(app_users_norm) - len(assigned_norm)}")

if __name__ == "__main__":
    process()
