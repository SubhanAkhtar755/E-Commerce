import Model from "../models/index.js";




const getData = async (id) => {
    if (!id) return null;  // agar id undefined ya null hai to null return kar do
    return await Model.findById(id);
};


const PostData = async (Data) => new Model(Data).save().then((user) => user.toObject());

const deleteData = async (id) => await Model.findByIdAndDelete(id);

const updateData = async (id, data) => await Model.findByIdAndUpdate(id, data, { new: true });

export {
    getData,
    PostData,
    deleteData,
    updateData
}