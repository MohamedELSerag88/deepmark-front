
export const API_BASE_URL_ENV = () => {
    const fromEnv = process.env.REACT_APP_API_BASE_URL;
    if (fromEnv && typeof fromEnv === 'string' && fromEnv.trim() !== '') {
        return fromEnv.replace(/\/+$/, '');
    }
    return 'http://165.232.103.85/api';
}

export const GET_AUTH_USER = () => JSON.parse(localStorage.getItem('auth'))

// export const handleFieldChange = (e, setFormData, formData) => {
//     setFormData({...formData, ...{[e.target.name]: e.target.value}})
// }

// export const handleSelectChange = (option, fieldName, setFormData, formData, cbFunc = {}) => {
//     const optionValues = Array.isArray(option) ? option.map(({value}) => value) : option ? option.value : null
//     setFormData({...formData, ...{[fieldName]: optionValues}})
//     if (!_.isEmpty({cbFunc}))
//         cbFunc[fieldName]
// }

// export const getOrderColor = (status) => {
//     switch (status) {
//         case OrderStatusEnum.PENDING.value:
//             return OrderStatusEnum.PENDING.className;
//         case OrderStatusEnum.APPROVED.value:
//             return OrderStatusEnum.APPROVED.className;
//         case OrderStatusEnum.CANCELED.value:
//             return OrderStatusEnum.CANCELED.className;
//         case OrderStatusEnum.DELIVERED.value:
//             return OrderStatusEnum.DELIVERED.className;
//         case OrderStatusEnum.REJECTED.value:
//             return OrderStatusEnum.REJECTED.className;
//         default:
//             return 'btnDone';
//     }
// }

// export const getBackgroundOrderColor = (status) => {
//     switch (status) {
//         case OrderStatusEnum.PENDING.value:
//             return 'bg-info';
//         case OrderStatusEnum.APPROVED.value:
//             return 'bg-success';
//         case OrderStatusEnum.CANCELED.value:
//             return 'bg-danger';
//         case OrderStatusEnum.DELIVERED.value:
//             return 'bg-warning';
//         case OrderStatusEnum.REJECTED.value:
//             return 'bg-danger';
//         default:
//             return 'bg-info';
//     }
// }


export const getLang = () => {
    return localStorage.getItem('web-kicks_lang');
}


