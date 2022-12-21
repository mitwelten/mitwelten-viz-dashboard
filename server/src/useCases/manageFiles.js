const manageFiles = async (httpsAccess, entry, entryId) => {
    try {
        let filesToBeAdded = []
        let filesToBeDeleted = []
        const previousEntry = await httpsAccess.findEntryById(entryId)

        filesToBeAdded = entry?.files?.filter(file => {
            const previousEntryFiles = previousEntry?.files?.map(_file => _file.name) || []
            return !previousEntryFiles.includes(file.name) || !file.name
        }) || []

        if (filesToBeAdded.length > 0) {
            await Promise.all(
                filesToBeAdded.map(async (file) => {
                  if(!file.link) {
                        const res = await httpsAccess.uploadFile(file);
                        console.log("res upload files to S3:", res)
                        const addedFile = await httpsAccess.addFileToEntry(entryId, ({
                            link: await res,
                            type: file.type,
                            name: file.name,
                        }))
                        return addedFile
                    }
                })
            )
        }

        filesToBeDeleted = previousEntry?.files?.filter(file => {
            const filesFromEntryToBeUpdated = entry?.files?.map(_file => _file.name) || []
            return !filesFromEntryToBeUpdated.includes(file.name)
        }) || []


        if (filesToBeDeleted.length > 0) {
            await Promise.all(
                filesToBeDeleted.map(async (file) => {
                    if(file.id) {
                        const res = await httpsAccess.deleteFile(file);
                        return res
                    }
                })
            )
        }

    } catch (error) {
        throw console.error(error);
    }
}

export default manageFiles