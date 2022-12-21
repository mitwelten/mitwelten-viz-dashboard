import { Entry, Tag, Image } from '../../db/database';
import httpsAccessor from './httpAccessor';

const httpAccess = httpsAccessor();

const dbAccessor = () => {
  const findAllTags = async () => {
    try {
      const tags = await Tag.findAll();

      return tags;
    } catch (err) {
      console.log(err);
    }
  };

  const findAllEntries = async () => {
    try {
      const entries = await Entry.findAll({ include: [Tag, Image] });
      return entries;
    } catch (err) {
      console.log(err);
    }
  };

  const createEntry = async (params) => {
    try {
      const images =
        params?.entry?.Images?.length > 0 &&
        (await Promise.all(
          params.entry.Images.map(async (img) => {
            const res = await httpAccess.uploadImage(img);
            const image = await Image.create({
              link: await res,
              type: img.type,
              name: img.name,
            });
            return image;
          })
        ));

      const entry = await Entry.create({
        name: params.entry.name,
        description: params.entry.description,
        lat: params.entry.lat,
        lng: params.entry.lon,
      });

      const tags =
        params?.entry?.Tags?.length > 0 &&
        (await Promise.all(
          params.entry.tags.map(async (tag) => {
            try {
              const [res, created] = await Tag.upsert({
                id: tag.id,
                name: tag.name,
              });
              return res;
            } catch (err) {
              console.log(err);
            }
          })
        ));

      if (tags) {
        await entry.addTags(tags);
      }
      if (images) {
        await entry.addImages(images);
      }
      return entry;
    } catch (err) {
      console.log(err);
    }
  };

  const updateEntry = async (params) => {
    try {
      const entry = await Entry.findByPk(params.entry.id);

      await entry.update({
        ...params.entry,
      });
      await entry.save();

      const tags =
        params?.entry?.Tags?.length > 0 &&
        (await Promise.all(
          params.entry.tags.map(async (tag) => {
            try {
              const [res, created] = await Tag.upsert({
                id: tag.id,
                name: tag.name,
              });
              return res;
            } catch (err) {
              console.log(err);
            }
          })
        ));

      const images =
        params?.entry?.Images?.length > 0 &&
        (await Promise.all(
          params.entry.Images.map(async (img) => {
            if (!img.id) {
              const res = await httpAccess.uploadImage(img);
              const image = await Image.create({
                link: await res,
                type: img.type,
                name: img.name,
              });
              return image;
            }
          })
        ));

      await entry.setTags([]);
      if (tags) {
        await entry.addTags(tags);
      }
      if (images) {
        await entry.addImages(images);
      }

      return entry;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    findAllTags,
    createEntry,
    updateEntry,
    findAllEntries,
  };
};

export default dbAccessor;
