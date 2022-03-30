import db from '../db.js'

class ProductController {
    async createProduct(request, response) {
        const {
            site_id,
            sex,
            category_id,
            category_title_ru,
            title,
            current_price,
            previous_price,
            color_id,
            brand_id,
            url,
            photos_url,
            unique_date,
            vk_photos
        } = request.body

        try {
            const newProduct = await db.query(`
                INSERT INTO products (site_id, sex, category_id, title, current_price, previous_price, color_id, 
                brand_id, url, photos_url, unique_date, vk_photos, vector) 
                
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
                    (
                        setweight(to_tsvector('russian', (
                            SELECT title FROM colors WHERE id = '${color_id}'
                        )), 'B') ||
                        setweight(to_tsvector('russian', (
                            SELECT title FROM brands WHERE id = '${brand_id}'
                        )), 'B') ||
                        setweight(to_tsvector('russian', (
                            SELECT title_ru FROM categories WHERE id = '${category_id}'
                        )), 'B') ||
                        setweight(to_tsvector('russian', '${title}'), 'D')
                    )
                ) RETURNING *`,
                [site_id, sex, category_id, title, current_price, previous_price, color_id, brand_id, url, photos_url,
                    unique_date, vk_photos]
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

    async checkProducts(request, response) {
        const {
            url
        } = request.body

        try {
            const product = await db.query(`
                SELECT EXISTS (
                    SELECT url FROM products WHERE url = $1
                )`,
                [
                    url,
                ]
            )
            response.status(200).send(product.rows[0])
        } catch (error) {
            response.status(500).send(error)
        }
    }

    async getOneProduct(request, response) {
        try {
            const url = decodeURI(request.params.url)

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
                WHERE url = '${url}'
            `)

            if (!product.rows.length) {
                response.status(202).send({
                    "name": "error",
                    "code": 1,
                    "detail": `The product with '${url}' will not find`,
                })
            } else {
                response.status(200).send({
                    "name": "success",
                    "product": product.rows[0]
                })
            }
        } catch (error) {
            response.status(500).send(error)
        }
    }

    async updateProduct(request, response) {
        try {
            const {
                current_price, previous_price, unique_date, url
            } = request.body

            const product = await db.query(`
                UPDATE products SET current_price = $1, previous_price = $2, 
                unique_date = $3 WHERE url = $4 RETURNING *`,
                [current_price, previous_price, unique_date, url]
            )

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