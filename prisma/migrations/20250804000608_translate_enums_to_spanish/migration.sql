/*
  Warnings:

  - The values [INCOME,EXPENSE] on the enum `EntryType` will be removed. If these variants are still used in the database, this will fail.
  - The values [FOOD,RENT,TRANSPORT,ENTERTAINMENT,UTILITIES,HEALTH,EDUCATION,SALARY,OTHER] on the enum `ExpenseCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EntryType_new" AS ENUM ('INGRESO', 'GASTO');
ALTER TABLE "Expense" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Expense" ALTER COLUMN "type" TYPE "EntryType_new" USING ("type"::text::"EntryType_new");
ALTER TYPE "EntryType" RENAME TO "EntryType_old";
ALTER TYPE "EntryType_new" RENAME TO "EntryType";
DROP TYPE "EntryType_old";
ALTER TABLE "Expense" ALTER COLUMN "type" SET DEFAULT 'GASTO';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ExpenseCategory_new" AS ENUM ('COMIDA', 'ALQUILER', 'TRANSPORTE', 'ENTRETENIMIENTO', 'SERVICIOS', 'SALUD', 'EDUCACION', 'DEPORTES', 'SALARIO', 'OTROS');
ALTER TABLE "Expense" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Expense" ALTER COLUMN "category" TYPE "ExpenseCategory_new" USING ("category"::text::"ExpenseCategory_new");
ALTER TYPE "ExpenseCategory" RENAME TO "ExpenseCategory_old";
ALTER TYPE "ExpenseCategory_new" RENAME TO "ExpenseCategory";
DROP TYPE "ExpenseCategory_old";
ALTER TABLE "Expense" ALTER COLUMN "category" SET DEFAULT 'OTROS';
COMMIT;

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "category" SET DEFAULT 'OTROS',
ALTER COLUMN "type" SET DEFAULT 'GASTO';
