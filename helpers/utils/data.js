const DataUtils = {
  addCreator: (payload = {}, options = {}) => {
    if (!options.currentUser) throw ERR.CURUSER_REQ;
    payload.created_by = ObjectId(options.currentUser);
    payload.updated_by = ObjectId(options.currentUser);
    return payload;
  },

  addUpdator: (payload = {}, options = {}) => {
    if (!options.currentUser) throw ERR.CURUSER_REQ;
    payload.updated_by = ObjectId(options.currentUser);
    return payload;
  },

  paging: async ({
    start = 0, limit = 20, sort, model, query, facet_data,
  }) => {
    query.push({
      $sort: sort,
    });
    let _facet_data = [
      {
        $skip: parseInt(start),
      },
      {
        $limit: parseInt(limit),
      },
    ];
    if (facet_data) _facet_data = _facet_data.concat(facet_data);
    query.push({
      $facet: {
        data: _facet_data,
        total: [
          {
            $group: {
              _id: null,
              count: {
                $sum: 1,
              },
            },
          },
        ],
      },
    });
    const matchedData = await model.aggregate(query);

    let data = [];
    let total = 0;
    if (matchedData[0].data.length > 0) {
      data = matchedData[0].data;
      total = matchedData[0].total[0].count;
    }

    return {
      data,
      total,
      limit,
      start,
      page: Math.round(start / limit) + 1,
    };
  },
};

module.exports = {
  DataUtils,
};
