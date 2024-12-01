const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/inputerror');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const score = await prediction.data();

        const cancerProbability = scores[0];
        const confidenceScore = cancerProbability * 100;

        const label = cancerProbability > 0.5 ? 'Cancer' : 'Non-cancer';

        let explanation, suggestion;

        if (label === 'Cancer') {
            explanation = "Penyakit kanker terdeteksi pada gambar ini.";
            suggestion = "Segera periksa ke dokter!";
        } else {
            explanation = "Tidak ada indikasi kanker pada gambar ini.";
            suggestion = "Penyakit kanker tidak terdeteksi.";
        }

        return { confidenceScore, label, explanation, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
