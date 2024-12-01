const predictClassification = require('../service/inferenceservice');
const crypto = require('crypto');
const storeData = require('../service/firestoreservice');
const { Firestore } = require('@google-cloud/firestore');

// Handler untuk Prediksi
async function postPredictHandler(request, h) {
    const { image } = request.payload;

    // Pastikan gambar tidak lebih besar dari 1MB
    if (Buffer.byteLength(image, 'base64') > 1000000) {
        return h.response({
            status: 'fail',
            message: 'Payload content length greater than maximum allowed: 1000000'
        }).code(413);
    }

    const { model } = request.server.app;

    try {
        // Prediksi menggunakan model
        const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        // Data yang akan disimpan
        const data = {
            id,
            result: label,
            explanation,
            suggestion,
            confidenceScore,
            createdAt
        };

        // Simpan data ke Firestore
        await storeData(id, data);

        // Kirim response
        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data: {
                id,
                result: label,
                suggestion: suggestion || 'Penyakit kanker tidak terdeteksi.',
                createdAt
            }
        }).code(201);

    } catch (error) {
        console.error('Prediction error:', error);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi'
        }).code(400);
    }
}

// Handler untuk Riwayat Prediksi
async function getPredictHandler(request, h) {
    const db = new Firestore(); // Membuat instance Firestore
    const predictionsCollection = db.collection('predictions'); // Akses koleksi 'predictions'

    try {
        // Ambil semua dokumen dari koleksi 'predictions'
        const snapshot = await predictionsCollection.get();

        if (snapshot.empty) {
            return h.response({
                status: 'fail',
                message: 'Tidak ada data riwayat prediksi.'
            }).code(404);
        }

        // Ambil data dari setiap dokumen
        const histories = snapshot.docs.map(doc => ({
            id: doc.id,
            history: doc.data(),
        }));

        // Kirimkan data riwayat prediksi
        return h.response({
            status: 'success',
            data: histories
        }).code(200);
    } catch (error) {
        console.error('Error retrieving histories:', error);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan saat mengambil data riwayat.'
        }).code(500);
    }
}

module.exports = { postPredictHandler, getPredictHandler };
