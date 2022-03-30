import db from '../db.js'

class BrandController {
    async getBrands(request, response) {
        try {
            const brands = await db.query(`
                SELECT 
                    id as brand_id,
                    title as brand_title
                FROM brands
            `)
            response.status(200).send(brands.rows)
        } catch (error) {
            response.status(500).send(error)
        }
    }
}

export default new BrandController