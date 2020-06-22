
function openTagQuickview(data) {
    addBackFunctionality(data);

    $('#quickViewTitle').html('Trait - '+capitalizeFirstLetterOfWord(data.TagName));
    let qContent = $('#quickViewContent');

    let tag = data.TagArray.find(tag => {
        if(tag.name != null){
            return tag.name.toUpperCase() === data.TagName.toUpperCase();
        } else {
            return tag.Tag.name.toUpperCase() === data.TagName.toUpperCase();
        }
    });

    if(tag != null){

        let tagDescription;
        if(tag.description != null){
            tagDescription = tag.description;
        } else {
            tagDescription = tag.Tag.description;
        }

        qContent.append(processText(tagDescription, true, true, 'MEDIUM'));

    } else {

        qContent.append('Failed to find trait!');

    }

}