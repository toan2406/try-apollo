const { paginateResults } = require('./utils');

module.exports = {
  Query: {
    allLaunches: (_, __, { dataSources }) =>
      dataSources.launchAPI.getAllLaunches(),

    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      allLaunches.reverse();
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches,
      });
      return {
        launches: launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false,
      };
    },

    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),

    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
  },

  Mission: {
    missionPatch: (mission, { size } = { size: 'LARGE' }) => {
      return size === 'SMALL'
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    },
  },

  Launch: {
    // mission is auto resolved if launch object has a property of the same name
    // mission: (_, __, ___) => ({
    //   name: 'mock name',
    //   missionPatchSmall: 'mock missionPatchSmall',
    //   missionPatchLarge: 'mock missionPatchLarge',
    //   missionPatch: 'this will be overwritten by missionPatch resolver',
    // }),
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
  },

  User: {
    trips: async (_, __, { dataSources }) => {
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
      if (!launchIds.length) return [];
      return (
        dataSources.launchAPI.getLaunchesByIds({
          launchIds,
        }) || []
      );
    },
  },
};
