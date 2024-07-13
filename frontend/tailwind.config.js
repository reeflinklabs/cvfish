module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Poppins", "sans-serif"],
        header: ["Nunito", "sans-serif"],
      },
      fontWeight: {
        header: 1000,
        body: 500,
      },
    },
  },
  daisyui: {
    themes: ["forest"],
  },
  plugins: [require("daisyui")],
};
