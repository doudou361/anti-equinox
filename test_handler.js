import handler from './api/book.js';

const mockReq = {
  method: 'POST',
  body: {
    formData: {
      fullName: "Imad",
      phone: "021555522",
      gender: "Homme",
      bloodGroup: "O+",
      birthdate: "07/26/2026"
    },
    planId: "base-1-1",
    months: 1
  }
};

const mockRes = {
  status: (code) => {
    console.log('STATUS:', code);
    return mockRes;
  },
  json: (data) => {
    console.log('JSON:', JSON.stringify(data, null, 2));
  }
};

(async () => {
  try {
    await handler(mockReq, mockRes);
  } catch(e) {
    console.error("FATAL ERROR:", e);
  }
})();
