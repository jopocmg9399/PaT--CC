
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

export const generateSocialMediaPost = async (products: Product[]) => {
  // Always use process.env.API_KEY directly for initialization as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const productInfo = products.map(p => ({
    name: p.name,
    price: `${p.unitPrice} ${p.unitCurrency}`,
    expiry: p.expiryDate,
    groupings: p.groupings.map(g => `${g.label}: ${g.price} ${g.currency}`),
    isOffer: p.isOffer
  }));

  const prompt = `Actúa como un experto en marketing para redes sociales. Crea un post atractivo para Facebook e Instagram para una tienda llamada "PaTí". 
  Destaca los siguientes productos, sus precios y ofertas especiales. Usa emojis y un tono cercano. 
  Menciona que tenemos agrupaciones de precios (estuches, paquetes, etc.).
  
  Productos: ${JSON.stringify(productInfo)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // The .text property directly returns the extracted string output.
    return response.text;
  } catch (error) {
    console.error("Error generating social media post:", error);
    return "Error generando el contenido de redes sociales.";
  }
};
