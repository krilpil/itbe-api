import db from '../db.js'

class ColorController {
    async getColors(request, response) {
        try {
            const colors = await db.query(`
                SELECT 
                    id as color_id,
                    title as color_title
                FROM colors
            `)
            response.status(200).send(colors.rows)
        } catch (error) {
            response.status(500).send(error)
        }
    }
}

export default new ColorController