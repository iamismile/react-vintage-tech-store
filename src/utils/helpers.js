// import url from './URL';

// flatten function
export function flattenProducts(data) {
  return data.map((item) => {
    // cloudinary
    let image = item.image.url;

    // local
    // let image = `${url}${item.image.url}`;

    return { ...item, image };
  });
}

// get featured products
export function featuredProducts(data) {
  return data.filter((item) => item.featured === true);
}
