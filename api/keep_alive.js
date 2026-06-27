export default async function handler(req, res) {
  const SB_URL = process.env.SB_URL || 'https://txnecdeccianklqqyrav.supabase.co';
  const SB_KEY = process.env.SB_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bmVjZGVjY2lhbmtscXF5cmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDQzMDIsImV4cCI6MjA5MTk4MDMwMn0.e2ybyt2Y8yHsZwRC-MZqi_qK525-CWpk-huQcQy-icM';

  try {
    const response = await fetch(`${SB_URL}/rest/v1/eval_estudiantes_notas?select=grado&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        success: false,
        error: `Supabase returned status ${response.status}: ${errorText}`
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      message: "Ping exitoso a Supabase",
      dataLength: data.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
