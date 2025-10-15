export const transferWithCredentialsEmail = (
  params: {
    userName: string
    ownerName: string
    toEmail: string
    vehicleMake: string
    vehicleModel: string
    vehicleYear: number
    transferCode: string
    tempPassword: string
  }
) => {
  const {
    userName,
    ownerName,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    transferCode,
    tempPassword
  } = params

  const vehicle = `${vehicleMake} ${vehicleModel} ${vehicleYear}`

  return `
  <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
    <h2 style="color: #2563eb;">🚗 Você recebeu um veículo no AutoCare</h2>
    <p>Olá <strong>${userName}</strong>,</p>
    <p><strong>${ownerName}</strong> está transferindo o veículo <strong>${vehicle}</strong> para você.</p>

    <div style="background: #f1f5f9; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0 0 8px; color: #0f172a; font-weight: bold;">Acesso inicial</p>
      <p style="margin: 0; color: #334155;">E-mail: <strong>${params.toEmail}</strong></p>
      <p style="margin: 4px 0 0; color: #334155;">Senha temporária: <strong>${tempPassword}</strong></p>
    </div>

    <div style="background: #eef2ff; border: 1px solid #e0e7ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0 0 8px; color: #0f172a; font-weight: bold;">Código de transferência</p>
      <h1 style="margin: 0; color: #4f46e5; font-size: 28px; letter-spacing: 4px;">${transferCode}</h1>
      <p style="margin: 8px 0 0; color: #334155;">Use este código após fazer login para aceitar o veículo.</p>
    </div>

    <a href="https://autocare.com/login" style="display:inline-block; background:#2563eb; color:#fff; padding:12px 20px; text-decoration:none; border-radius:6px; margin: 12px 0;">Fazer login</a>
    <p style="color:#64748b; font-size:12px;">Por segurança, você deverá trocar a senha no primeiro acesso.</p>

    <hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0;" />
    <p style="color:#64748b; font-size:12px;">AutoCare - Gestão Inteligente de Veículos</p>
  </div>
  `
}
