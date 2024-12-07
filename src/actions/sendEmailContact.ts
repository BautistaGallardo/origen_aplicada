import { ContactEmail, ContactEmailType } from '@/libs/zod';

'use server';

export async function sendEmail(emailData: ContactEmailType) {

  console.log('Datos del correo:', emailData);
  return { success: true };
}
