const orderNumberGenerator = (length) => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * ((charset.length - 1) - 0 + 1));
        randomString += charset[randomIndex];
    }
    return randomString;
};

module.exports = orderNumberGenerator;
