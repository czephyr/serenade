import os

SMS_PATIENT_CREATE = """Nuova installazion da effettuare, buon lavoro!"""
ADMIN_USERNAME = "~serenade"
SALT_HASH = bytes.fromhex(os.getenv("SALT_HASH", ""))
