const yup = require('yup');
const isPNG = require('is-png');
const isJPG = require('is-jpg');

const uuidSchema = yup.object().shape({
    params: yup.object().shape({
        cache_id: yup.string().uuid('id must be in uuid format'),
        user_id: yup.string().uuid('id must be in uuid format'),
        image_id: yup.string().uuid('id must be in uuid format'),
        collection_id: yup.string().uuid('id must be in uuid format')
    })
});

const imageSizesSchema = yup.object().shape({
    params: yup.object().shape({
        image_size: yup.string().oneOf(['icon', 'small', 'medium', 'large', 'full'])
    })
})

const coordinatesSchema = yup.object().shape({
    params: yup.object().shape({
        latitude: yup.number().min(-90.0, 'latitude must be >= -90').max(90.0, 'latitude must be <= 90').required('latitude required'),
        longitude: yup.number().min(-180.0, 'longitude must be >= -180').max(180.0, 'longitude must be <= 180').required('longitude required'),
        radius: yup.number().positive('radius must be positive').required('radius required')
    })
})

const imageTypesSchema = yup.object().shape({
    headers: yup.object().shape({
        'content-type': yup.string().oneOf(['image/png', 'image/jpeg'], 'content type must be one of  [image/png, image/jpeg]')
    }),
    body: yup.mixed().required('image data is required')
        .test('is-not-empty', 'image data is required', (value) => (value.length > 0))
        .test('is-image', 'data must be in png or jpg format', (value) => (isPNG(value) || isJPG(value)))
});

const loginSchema = yup.object().shape({
    body: yup.object().shape({
        email: yup.string().email().required('email required'),
        password: yup.string().required('password required')
    })
});

const registerSchema = yup.object().shape({
    body: yup.object().shape({
        email: yup.string().email('email must follow email format').required('email required'),
        username: yup.string().required('username required'),
        password: yup.string().required('password required'),
        interests: yup.array().of(yup.string()).required('interests required'),
        terms_of_use: yup.boolean().required('terms_of_use required'),
        privacy_policy: yup.boolean().required('privacy_policy required'),
        license: yup.boolean().required('license required')
    })
});

const createCacheSchema = yup.object().shape({
    body: yup.object().shape({
        latitude: yup.number().min(-90.0, 'latitude must be >= -90').max(90.0, 'latitude must be <= 90').required('latitude required'),
        longitude: yup.number().min(-180.0, 'longitude must be >= -180').max(180.0, 'longitude must be <= 180').required('longitude required'),
        title: yup.string().max(50, 'title length > 50').required('title required'),
        description: yup.string().required('description required'),
        link: yup.string().url('link not in url format').notRequired(),
        tags: yup.array().of(yup.string().max(50, 'tag length must be < 50')).min(1, 'tag count must be >= 1').max(3, 'tag count must be <= 3').required('tags required'),
        public: yup.boolean().required('public required')
    })
});

const commentSchema = yup.object().shape({
    body: yup.object().shape({
        content: yup.string().required('content required')
    })
});

const updateUserSchema = yup.object().shape({
    body: yup.object().shape({
        email: yup.string().email().notRequired(),
        username: yup.string().notRequired(),
        password: yup.string().notRequired(),
        current_password: yup.string().notRequired(),
        interests: yup.array().of(yup.string()).notRequired(),
        terms_of_use: yup.boolean().notRequired(),
        privacy_policy: yup.boolean().notRequired(),
        license: yup.boolean().notRequired()
    }).test('at-least-one-field', 'at least one field must be provided', (value) =>
        !!(value.email || value.username || value.password || value.interests || (value.terms_of_use != null) || (value.privacy_policy != null) || (value.license != null)))
    .test('current-password', 'when updating a password, the current password must be provided', (value) => (!!value.password === !!value.current_password))
});

const collectionSchema = yup.object().shape({
    body: yup.object().shape({
        title: yup.string().required('title required'),
        visibility: yup.boolean().notRequired()
    })
});

const updateCollectionSchema = yup.object().shape({
    body: yup.object().shape({
        title: yup.string().notRequired(),
        visibility: yup.boolean().notRequired()
    }).test('at-least-one-field', 'at least one field must be provided', (value) =>
        !!(value.title || value.visibility))
});

module.exports = {
    uuidSchema,
    imageSizesSchema,
    coordinatesSchema,
    imageTypesSchema,
    loginSchema,
    registerSchema,
    createCacheSchema,
    commentSchema,
    updateUserSchema,
    collectionSchema,
    updateCollectionSchema
}