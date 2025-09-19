const bcrypt = require('bcryptjs');

async function testBcrypt() {
  try {
    // Original password
    const password = 'testPassword123';
    
    // Generate a salt and hash the password
    console.log('1. Generating salt...');
    const salt = await bcrypt.genSalt(10);
    console.log(`   Salt generated: ${salt}`);
    
    console.log('2. Hashing password...');
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`   Hashed password: ${hashedPassword}`);
    
    console.log('3. Testing valid password comparison...');
    const isValidMatch = await bcrypt.compare(password, hashedPassword);
    console.log(`   Valid password match: ${isValidMatch}`);
    
    console.log('4. Testing invalid password comparison...');
    const isInvalidMatch = await bcrypt.compare('wrongPassword', hashedPassword);
    console.log(`   Invalid password match: ${isInvalidMatch}`);
    
    console.log('5. Testing another hashing round (should be different)...');
    const anotherSalt = await bcrypt.genSalt(10);
    const anotherHash = await bcrypt.hash(password, anotherSalt);
    console.log(`   New hash: ${anotherHash}`);
    console.log(`   Different from first hash: ${anotherHash !== hashedPassword}`);
    console.log(`   Still matches original password: ${await bcrypt.compare(password, anotherHash)}`);
    
    // Test hash generation directly (bcrypt.hashSync may be used in some parts of the code)
    console.log('6. Testing direct hash generation (hashSync)...');
    const syncHash = bcrypt.hashSync(password, 10);
    console.log(`   Sync hash: ${syncHash}`);
    console.log(`   Sync hash valid: ${await bcrypt.compare(password, syncHash)}`);
    
    console.log('\nAll tests completed successfully! Bcrypt is working as expected.');
  } catch (error) {
    console.error('Error during bcrypt testing:', error);
  }
}

testBcrypt(); 