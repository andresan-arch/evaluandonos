import csv
import os

# Files
USERS_FILE = r'c:\Users\ANDRESAN\Desktop\Evaluandonos\docentes\usuarios-evaluandonos_total.csv'
ASSIGNMENTS_FILE = r'c:\Users\ANDRESAN\Desktop\Evaluandonos\docentes\NUEVA ASIGNACIÓN 2026 .csv'
OUTPUT_FILE = r'c:\Users\ANDRESAN\Desktop\Evaluandonos\docentes\docentes_import_final_v3.csv'

# Director mapping (from previous version/context)
DIRECTORES = {
    "601": "Ricardo Neftali Velez Suarez",
    "602": "Piedad Cecilia Granados Velasco",
    "603": "Gaby Cecilia Teran Dominguez",
    "701": "Henry Hernan Cruz Ceron",
    "702": "Adriana Ruiz Rivera",
    "703": "Sonia Adiela Mena Gonzalez",
    "801": "Telly Alejandro Castillo Diaz",
    "802": "Luis Eduardo Yunda Cifuentes",
    "901": "Guido Alberto Imbachi Fernandez",
    "902": "Clara Ines Urrea Montenegro",
    "903": "Diana Patricia Trochez Lopez",
    "1001": "James Yamiht Diaz Leyton",
    "1002": "Carlos Enrique Orozco Agredo",
    "1003": "Mayra Cilena Lopez",
    "1101": "Edwin Julian Muñoz Cabezas",
    "1102": "Jhony Ferney Ibarra Vasquez",
    "1103": "Edgar Velasco Quintero",
    "0": "Adriana Bonilla Cadavid",
    "1": "Leidy Yohana Truque Ceron",
    "2": "Zulma Andrea Rengifo Ruiz",
    "3": "Maria Evila Cordoba Paladines",
    "4": "Derly Alejandra Hermida Muñoz",
    "5": "Lilia Graciela Fuli Mendez"
}

def clean_name(name):
    return name.strip() if name else ""

def process():
    user_sede = {}
    all_users = []
    
    # 1. Load users
    with open(USERS_FILE, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';')
        for row in reader:
            name = clean_name(row['nombre'])
            if not name: continue
            sede = row['sede'].strip()
            user_sede[name] = sede
            all_users.append(name)

    final_rows = []
    seen_permissions = set()

    # 2. Parse NEW assignments format
    if os.path.exists(ASSIGNMENTS_FILE):
        with open(ASSIGNMENTS_FILE, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=';')
            header = next(reader) # Skip header
            
            for row in reader:
                if len(row) < 3: continue
                docente_name = clean_name(row[0])
                asignatura = row[1].strip()
                
                if not docente_name or not asignatura: continue
                
                # Match docente name with our canonical list
                matched_name = None
                for u in all_users:
                    if docente_name.upper() in u.upper():
                        matched_name = u
                        break
                
                if not matched_name:
                    print(f"Warning: Could not find user for {docente_name}")
                    continue
                
                sede = user_sede.get(matched_name, 'Central')
                
                # Iterate through grade columns
                for i in range(2, len(row)):
                    grade = row[i].strip()
                    if not grade: continue
                    
                    # SPECIAL FIX: Maria Eugenia does NOT give Lenguaje in 901
                    if "MARIA EUGENIA" in matched_name.upper() and "LENGUAJE" in asignatura.upper() and grade == "901":
                        print(f"Skipping 901 Lenguaje for Maria Eugenia")
                        continue
                    
                    # ADD GRANULAR PERMISSION: Link Subject to Grade
                    perm_a = (matched_name, 'ASIGNACION', grade, asignatura, sede)
                    if perm_a not in seen_permissions:
                        final_rows.append(perm_a)
                        seen_permissions.add(perm_a)
                    
                    # Add GRADO permission
                    perm_g = (matched_name, 'GRADO', grade, '', sede)
                    if perm_g not in seen_permissions:
                        final_rows.append(perm_g)
                        seen_permissions.add(perm_g)

    # 3. Add Director permissions
    for grade, director in DIRECTORES.items():
        sede = user_sede.get(director, 'Central')
        perm_d = (director, 'GRADO', grade, '', sede)
        if perm_d not in seen_permissions:
            final_rows.append(perm_d)
            seen_permissions.add(perm_d)

    # 4. Add SEDE permission and handle "other sedes"
    for user in all_users:
        sede = user_sede.get(user, 'Central')
        
        # Mandatory SEDE permission
        perm_s = (user, 'SEDE', '', '', sede)
        if perm_s not in seen_permissions:
            final_rows.append(perm_s)
            seen_permissions.add(perm_s)
        
        # Non-Central sedes: special ASIGNACION for the whole sede
        if sede != 'Central':
            perm_special = (user, 'ASIGNACION', '', sede, sede)
            if perm_special not in seen_permissions:
                final_rows.append(perm_special)
                seen_permissions.add(perm_special)

    # 5. Write output
    with open(OUTPUT_FILE, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['nombre', 'tipo', 'grado', 'asignatura', 'sede'])
        for row in final_rows:
            writer.writerow(row)
    
    print(f"File created: {OUTPUT_FILE}")
    print(f"Total permissions: {len(final_rows)}")

if __name__ == "__main__":
    process()
