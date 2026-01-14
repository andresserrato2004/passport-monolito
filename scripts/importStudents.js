const fs = require('fs');
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function importStudents(filePath) {
  try {
    // 1. Leer el archivo Excel
    if (!fs.existsSync(filePath)) {
      console.error(`❌ El archivo no existe: ${filePath}`);
      process.exit(1);
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log(`📊 Encontrados ${data.length} estudiantes en el archivo.`);

    let successCount = 0;
    let errorCount = 0;

    // 2. Procesar cada estudiante
    for (const row of data) {
      // Mapear columnas del Excel a variables
      // Ajustado según requerimientos del usuario:
      const rawId = row['Documento Identidad'];
      const name = row['Nombres y Apellidos'];
      const rawCareer = row['Programa Académico'];
      
      // El correo será el mismo documento de identidad según instrucción
      const email = rawId ? String(rawId) : null;
      
      const id = rawId ? parseInt(rawId) : null;
      const career = rawCareer ? String(rawCareer) : null;
      const rawPassword = id ? id.toString() : '123456'; 

      if (!id || !name) {
        console.warn(`⚠️ Fila incompleta (falta Documento o Nombre):`, JSON.stringify(row));
        errorCount++;
        continue;
      }

      try {
        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(rawPassword, 10);

        // Insertar o actualizar en base de datos
        // Usamos upsert para no fallar si ya existe, solo actualizar datos
        // Nota: Como el email es el mismo ID, la búsqueda por email o id es equivalente.
        await prisma.user.upsert({
          where: { id: id }, // Usamos ID como clave única principal
          update: {
            name: String(name),
            email: email,
            carrer: career, 
            passwordHash: passwordHash
          },
          create: {
            id: id,
            name: String(name),
            email: email,
            carrer: career,
            passwordHash: passwordHash
          }
        });

        process.stdout.write('.'); // Progreso visual
        successCount++;
      } catch (dbError) {
        console.error(`\n❌ Error importando ${email}:`, dbError.message);
        errorCount++;
      }
    }

    console.log('\n\n✅ Importación finalizada.');
    console.log(`Total procesados: ${data.length}`);
    console.log(`Exitosos: ${successCount}`);
    console.log(`Fallidos: ${errorCount}`);

  } catch (error) {
    console.error('❌ Error general en el script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Obtener ruta del archivo desde argumentos
const excelFile = process.argv[2];

if (!excelFile) {
  console.log('Uso: node scripts/importStudents.js <ruta-al-excel>');
  process.exit(1);
}

importStudents(excelFile);
