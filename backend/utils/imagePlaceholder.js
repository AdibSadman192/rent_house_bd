const placeholderImages = {
    property: {
        apartment: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
        house: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        office: 'https://images.pexels.com/photos/1743555/pexels-photo-1743555.jpeg',
        mess: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
        shop: 'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg'
    },
    room: {
        bedroom: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
        livingRoom: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg',
        kitchen: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
        bathroom: 'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg'
    },
    amenity: {
        lift: 'https://images.pexels.com/photos/8241135/pexels-photo-8241135.jpeg',
        generator: 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg',
        security: 'https://images.pexels.com/photos/3205735/pexels-photo-3205735.jpeg',
        parking: 'https://images.pexels.com/photos/1004665/pexels-photo-1004665.jpeg',
        prayerRoom: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg'
    },
    area: {
        dhaka: {
            gulshan: 'https://images.pexels.com/photos/2096700/pexels-photo-2096700.jpeg',
            banani: 'https://images.pexels.com/photos/2096700/pexels-photo-2096700.jpeg',
            dhanmondi: 'https://images.pexels.com/photos/2096700/pexels-photo-2096700.jpeg',
            uttara: 'https://images.pexels.com/photos/2096700/pexels-photo-2096700.jpeg',
            mohammadpur: 'https://images.pexels.com/photos/2096700/pexels-photo-2096700.jpeg'
        }
    },
    profile: {
        default: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg',
        business: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg'
    }
};

/**
 * Get a placeholder image URL based on the type and category
 * @param {string} type - Main category (property, room, amenity, area, profile)
 * @param {string} subType - Sub-category
 * @param {string} [area] - Area name for area type
 * @returns {string} Placeholder image URL
 */
function getPlaceholderImage(type, subType, area = null) {
    try {
        if (type === 'area' && area) {
            return placeholderImages.area[area.toLowerCase()]?.[subType.toLowerCase()] 
                || placeholderImages.area.dhaka.gulshan; // Default area image
        }
        
        return placeholderImages[type.toLowerCase()]?.[subType.toLowerCase()] 
            || placeholderImages.property.apartment; // Default property image
    } catch (error) {
        console.error('Error getting placeholder image:', error);
        return placeholderImages.property.apartment; // Fallback default
    }
}

/**
 * Check if an image URL is valid
 * @param {string} url - Image URL to check
 * @returns {Promise<boolean>} True if image is valid
 */
async function isImageValid(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        return response.ok && contentType.startsWith('image/');
    } catch (error) {
        console.error('Error checking image validity:', error);
        return false;
    }
}

/**
 * Get a valid image URL or return a placeholder
 * @param {string} imageUrl - Original image URL
 * @param {string} type - Type of placeholder needed
 * @param {string} subType - Sub-type of placeholder
 * @param {string} [area] - Area name for area type
 * @returns {Promise<string>} Valid image URL or placeholder
 */
async function getValidImageUrl(imageUrl, type, subType, area = null) {
    if (imageUrl && await isImageValid(imageUrl)) {
        return imageUrl;
    }
    return getPlaceholderImage(type, subType, area);
}

module.exports = {
    getPlaceholderImage,
    isImageValid,
    getValidImageUrl
};
