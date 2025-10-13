import os
import time
import subprocess

repo_path = r"C:\WebSite\CMCHEmployee"

INTERVAL = 3 * 3600
I = 0

while True:
    print(f"Esperando {INTERVAL/3600} horas para la proxima actualizacion...\n")
    time.sleep(INTERVAL)
    if (I < INTERVAL):
        print("Actualizando repositorio..")
        os.chdir(repo_path)
        try:
            result = subprocess.run(["git", "pull"], capture_output=True, text=True)
            print(result.stdout)
            print("Verificando actualizaciones")
            output = result.stdout.strip()
            print(output)
            if "Already up to date" in output or "Already up-to-date" in output:
                print("No se encontraron actualizaciones.\n")
            else:
                print("Actualizando..")
                print("Cambios hechos correctamente")
        except Exception as e:
            print("Error al actualizar", e)

        