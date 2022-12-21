const manageTags = async (httpsAccess, entry, entryId) => {
    try {
        let tagsToBeAdded = []
        let tagsToBeDeleted = []
        const previousEntry = await httpsAccess.findEntryById(entryId)
  
        tagsToBeAdded = entry?.tags?.filter(tag => {
            const tagIdsFromPreviousEntry = previousEntry?.tags?.map(_t => _t.id) || []
            return !tagIdsFromPreviousEntry.includes(tag.id) || !tag.id
        }) || []
 
        if(tagsToBeAdded.length > 0) {
            await Promise.all(
                tagsToBeAdded.map(async (tag) => {
                    if(!tag.id) {
                        const tagCreated = await httpsAccess.createTag(tag);
                        const assignedTag = await httpsAccess.addTagToEntry(entryId, tagCreated)
                        return assignedTag
                    }
                    const res = await httpsAccess.addTagToEntry(entryId, tag)
                    return res
                })
            )
        }
        
        tagsToBeDeleted = previousEntry?.tags?.filter(tag => {
            const tagIdsFromEntryToBeUpdated = entry.tags
                    .filter(_t => _t.id)
                    .map(_t => _t.id)
            return !tagIdsFromEntryToBeUpdated.includes(tag.id)
        }) || []
       
        if (tagsToBeDeleted.length > 0) {
            await Promise.all(
                tagsToBeDeleted.map(async (tag) => {
                    if(tag.id) {
                        const res = await httpsAccess.deleteTagFromEntry(entryId, tag);
                        return res
                    }
                })
            )
        }     
    } catch (error) {
        throw console.error(error);
    }
}

export default manageTags;