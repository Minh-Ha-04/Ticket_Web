import Team from "../models/team.js";

export const createTeam = async (teamData) => 
{
    return await Team.create(teamData);
}

export const updateTeam = async (id,teamData) =>
{
    const team = await Team.findByPk(id);
    if(!team)
    {
        throw new Error("Not found Team!!");
    }
    return await team.update(teamData);
}

export const deleteTeam = async(id) =>
{
    const team = await Team.findByPk(id);
    if(!team)
    {
        throw new Error("Not found Team!!");
    }
    return await team.destroy();
}

export const getAllTeams = async(page = 1, pageSize = 10) =>
{
    const offset = (page-1)*pageSize;
    const {count , rows} = await Team.findAndCountAll({
        limit : pageSize,
        offset : offset,
        order : [['name','ASC']]
    })
    return {
        totalItem : count,
        totalPage : Math.ceil(count / pageSize),
        currentPafe : page,
        teams : rows
    }
}

export const getTeamById = async (id) => {
    return await Team.findByPk(id);
};