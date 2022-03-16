import db from '../db.js'

class ProductController {
    async createProduct(request, response) {
        const {
            site_id, sex, category_id, title, current_price, previous_price, color_id, brand_id, url, photos_url,
            unique_date, vk_photos
        } = request.body

        try {
            const newProduct = await db.query(`
                INSERT INTO products (
                    site_id,
                    sex, 
                    category_id, 
                    title, 
                    current_price, 
                    previous_price, 
                    color_id, 
                    brand_id, 
                    url, 
                    photos_url, 
                    unique_date, 
                    vk_photos
                ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
                [
                    site_id,
                    sex,
                    category_id,
                    title,
                    current_price,
                    previous_price,
                    color_id,
                    brand_id,
                    url,
                    photos_url,
                    unique_date,
                    vk_photos
                ]
            )

            response.status(200).send(newProduct.rows[0])
        } catch (error) {
            response.status(500).send(error)
        }
    }

    async getProducts(request, response) {
        try {
            const products = await db.query(`
                SELECT 
                    sites.title as site_title, 
                    products.sex as sex, 
                    categories.title_ru as category_title, 
                    products.title,
                    products.current_price,
                    products.previous_price,
                    colors.title as colors_title,
                    brands.title as brands_title,
                    products.url,
                    products.photos_url,
                    products.unique_date,
                    products.vk_photos,
                    products.id
                FROM products
                JOIN sites ON products.site_id = sites.id
                JOIN categories ON products.category_id = categories.id
                JOIN colors ON products.color_id = colors.id
                JOIN brands ON products.brand_id = brands.id
            `)
            response.status(200).send(products.rows)
        } catch (error) {
            response.status(500).send(error)
        }
    }

    async getOneProduct(request, response) {
        try {
            const url = request.params.url
            const product = await db.query(`
                SELECT 
                    sites.title as site_title, 
                    products.sex as sex, 
                    categories.title_ru as category_title, 
                    products.title,
                    products.current_price,
                    products.previous_price,
                    colors.title as colors_title,
                    brands.title as brands_title,
                    products.url,
                    products.photos_url,
                    products.unique_date,
                    products.vk_photos,
                    products.id
                FROM products
                JOIN sites ON products.site_id = sites.id
                JOIN categories ON products.category_id = categories.id
                JOIN colors ON products.color_id = colors.id
                JOIN brands ON products.brand_id = brands.id
                WHERE url = $1
            `, [url])

            if (!product.rows.length) {
                throw `The product with url = "${url}" will not find`
            }

            response.status(200).send(product.rows[0])
        } catch (error) {
            response.status(500).send(error)
        }
    }

    async updateProduct(request, response) {
        try {
            const {
                site, url
            } = request.body

            const product = await db.query(`UPDATE products SET site = $1 WHERE url = $2 RETURNING *`, [site, url])

            response.status(200).send(product.rows[0])
        } catch (error) {
            response.status(500).send(error)
        }
    }

    async deleteProduct(request, response) {
        try {
            const url = request.params.url
            const product = await db.query(`DELETE FROM products WHERE url = $1`, [url])

            if (product.rowCount === 0) {
                throw `The product with url = "${url}" will not find`
            }

            response.status(200).send(url)
        } catch (error) {
            response.status(500).send(error)
        }
    }
}

export default new ProductController