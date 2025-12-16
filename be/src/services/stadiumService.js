import Stadium from "../models/stadium.js";

export const getAllStadiums = async (page = 1, pageSize = 10) => {
    const offset = (page - 1) * pageSize;
    const {count, rows} = await Stadium.findAndCountAll({ 
        limit: pageSize,
        offset: offset,
        order:[['name','ASC']]
    });
    return {
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
        stadiums: rows
    };
}

export const getStadiumById = async(id)=>{
    return await Stadium.findByPk(id);
}

export const createStadium = async (stadiumData) => {
    return await Stadium.create(stadiumData);
}

export const updateStadium = async (id, stadiumData) => {
    const stadium = await Stadium.findByPk(id);
    if (!stadium) {
        throw new Error('Stadium not found');
    }
    return await stadium.update(stadiumData);
    
}

export const deleteStadium = async (id) => {
    const stadium = await Stadium.findByPk(id);
    if (!stadium) {
        throw new Error('Stadium not found');
    }
    return await stadium.destroy();
}