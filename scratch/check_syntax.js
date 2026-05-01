
const fs = require('fs');
const code = fs.readFileSync('c:\\Users\\ANDRESAN\\Desktop\\Evaluandonos\\index.html', 'utf8');
const scriptMatch = code.match(/<script>([\s\S]*?)<\/script>/g);
if (scriptMatch) {
  scriptMatch.forEach((s, idx) => {
    const scriptBody = s.replace('<script>', '').replace('</script>', '');
    try {
      new Function(scriptBody);
      console.log(`Script ${idx} is OK`);
    } catch (e) {
      console.error(`Error in Script ${idx}:`, e.message);
      // Try to find the line number
      const lines = scriptBody.split('\n');
      console.log('Approximate location of error:');
      // This is a bit hard without a real parser but let's try
    }
  });
}
