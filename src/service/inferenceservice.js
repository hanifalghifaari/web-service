const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/inputerror');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const classes = ['Non-cancer', 'Cancer'];

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

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
