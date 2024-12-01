const { postPredictHandler, getPredictHandler } = require("../server/handler"); // Pastikan handler yang diperlukan diimpor dengan benar

const routes = [
	{
		path: "/predict",
		method: "POST",
		handler: postPredictHandler, // Handler untuk prediksi
		options: {
			payload: {
				allow: "multipart/form-data", // Mengizinkan data gambar
				multipart: true,
				maxBytes: 1000000, // Membatasi ukuran file maksimal 1MB
				output: 'data', // Untuk menerima data gambar langsung dari request
			},
		},
	},
	{
		path: "/predict/histories",
		method: "GET",
		handler: getPredictHandler, // Handler untuk mengambil riwayat prediksi
		options: {},
	},
];

module.exports = routes;
