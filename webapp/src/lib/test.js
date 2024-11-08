try {
    var error = createCard().error;
    if (error) {
        throw error;
    }
}
catch (err) {
    console.log('Testerror: ' + err.message);
}
function createCard() {
    try {
        throw new Error('Failed to insert card: No data found');
    }
    catch (error) {
        return { success: false, error: error };
    }
}
