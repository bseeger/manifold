import uuid from 'uuid';

const commentDate = new Date();
commentDate.setDate(commentDate.getDate() - 4); // Must be constant for comment snapshot 'days ago' rendering

const defaults = {

  settings: {
    type: "settings",
    attributes: {
      general: {},
      theme: {
        typekitId: null
      },
      oauth: {
        facebook: {
          enabled: false
        },
        googleOauth2: {
          enabled: true
        },
        twitter: {
          enabled: true
        }
      }
    },
    features: {},
    integrations: {
      gaProfileId: null,
      gaTrackingId: null,
      twitterAppId: null,
      facebookAppId: null,
      googleClientId: null,
      googleProjectId: null,
      googleClientEmail: null,
      twitterAccessToken: null,
      googlePrivateKeyId: null,
      googleOauthClientId: null
    },
    secrets: {
      googlePrivateKey: null,
      twitterAppSecret: null,
      facebookAppSecret: null,
      googleOauthClientSecret: null,
      twitterAccessTokenSecret: null
    },
    pressLogoStyles: {
      small: null,
      smallSquare: null,
      smallLandscape: null,
      smallPortrait: null,
      medium: null,
      mediumSquare: null,
      mediumLandscape: null,
      mediumPortrait: null,
      largeLandscape: null,
      original: null
    }
  },

  project: {
    type: "projects",
    attributes: {
      title: "Rowan Test",
      subtitle: "World's Greatest Dog",
      heroStyles: {},
      coverStyles: {},
      avatarStyles: {}
    },
    relationships: {
      resources: []
    }
  },

  collection: {
    type: "collections",
    attributes: {
      title: "Rowan",
      createdAt: "2017-04-24T23:25:50.161Z",
      resourceKinds: ["image", "video"],
      resourceTags: ["dog"],
      thumbnailStyles: {}
    },
    relationships: {
      resources: []
    }
  },

  collectionResource: {
    type: "collectionResources",
    attributes: {
      position: 1,
      collectionId: 2
    },
    relationships: {
      resource: null,
      collection: null
    }
  },

  resource: {
    type: "resources",
    attributes: {
      title: "Image",
      titleFormatted: "Image",
      kind: "image",
      attachmentStyles: {
        medium: null
      },
      descriptionFormatted: "Black and white freckles",
      createdAt: "2017-04-24T23:25:50.161Z",
      captionFormatted: "World's Greatest Dog",
      downloadable: true,
      tagList: ["dog", "puppy", "GOAT"]
    },
    relationships: {
      collectionResources: []
    }
  },

  comment: {
    type: "comments",
    attributes: {
      body: "Plaid clash with polka dots, I hope you ain't mad.",
      createdAt: commentDate
    },
    relationships: {
      creator: null
    }
  },

  user: {
    type: "users",
    attributes: {
      email: "test@cic-fake.gotcha",
      firstName: "Rowan",
      lastName: "Ida",
      fullName: "Rowan Ida",
      role: "Admin",
      avatarStyles: {},
      isCurrentUser: true
    }
  },

  event: {
    type: "events",
    attributes: {
      eventType: "TEXT_ADDED",
      eventTitle: "Text Added",
      eventSubtitle: "It was added",
      subjectType: "Text",
      subjectTitle: "New Text",
      createdAt: "2017-04-24T23:25:50.161Z"
    }
  },

  tweetEvent: {
    type: "events",
    attributes: {
      eventType: "TWEET",
      eventTitle: "Tweet Created",
      subjectType: "Tweet",
      subjectTitle: "New Tweet",
      createdAt: "2017-04-24T23:25:50.161Z",
      attributionName: "Manifold Scholarship",
      attributionUrl: "https://twitter.com/ManifoldScholar",
      attributionIdentifier: "ManifoldScholar",
      excerpt: "Manifold is great!"
    }
  },

  text: {
    type: "texts",
    attributes: {
      title: "Ain't No Thang",
      creatorNames: "Andre3000, Big Boi",
      createdAt: "2017-04-24T23:25:50.161Z",
      published: true,
      coverStyles: {},
      rights: "All Rights Reserved",
      publicationDate: "2001-12-04"
    },
    relationships: {
      category: null
    }
  },

  category: {
    type: "categories",
    attributes: {
      title: "Hip Hop Classics",
      position: 1
    },
    relationships: {}
  }

};

const buildEntity = (entityType, id = null, attributes, relationships) => {
  const entity = defaults[entityType];
  return {
    type: entity.type,
    id: id || uuid.v1(),
    attributes: Object.assign({}, entity.attributes, attributes),
    relationships: Object.assign({}, entity.relationships, relationships)
  };
};

const project = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("project", id, attributes, relationships);
};

const resource = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("resource", id, attributes, relationships);
};

const collection = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("collection", id, attributes, relationships);
};

const collectionResource = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("collectionResource", id, attributes, relationships);
};

const comment = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("comment", id, attributes, relationships);
};

const user = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("user", id, attributes, relationships);
};

const settings = (id = 0, attributes = {}, relationships = {}) => {
  return buildEntity("settings", id, attributes, relationships);
};

const event = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("event", id, attributes, relationships);
};

const tweetEvent = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("tweetEvent", id, attributes, relationships);
};

const text = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("text", id, attributes, relationships);
};

const category = (id = null, attributes = {}, relationships = {}) => {
  return buildEntity("category", id, attributes, relationships);
};

export default {
  defaults,
  project,
  resource,
  collection,
  collectionResource,
  comment,
  user,
  settings,
  event,
  tweetEvent,
  text,
  category
};
