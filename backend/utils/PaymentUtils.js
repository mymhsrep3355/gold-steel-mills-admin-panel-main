// utils/paymentUtils.js

function applyThirdPayment(balance, advance, thirdPayment) {
    console.log('Applying third payment...');
    if (thirdPayment >= balance) {
        thirdPayment -= balance;
        balance = 0;
    } else {
        balance -= thirdPayment;
        thirdPayment = 0;
    }

    advance += thirdPayment;
    console.log('Third payment applied successfully.');
    return { balance, advance };
}

function applyThirdPaymentToAdvancedFirst(advance, balance, thirdPayment) {
    console.log('Applying third payment to advance first...');
    if (thirdPayment >= advance) {
        thirdPayment -= advance;
        advance = 0;
    } else {
        advance -= thirdPayment;
        thirdPayment = 0;
    }

    balance += thirdPayment;
    console.log('Third payment applied to advance first successfully.');
    return { advance, balance };
}

module.exports = {
    applyThirdPayment,
    applyThirdPaymentToAdvancedFirst
};
