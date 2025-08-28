import { useCollections } from "@/hooks/useCollections";
import StandardAutocomplete, { StandardAutocompleteProps } from "../StandardAutocomplete";
import AddPublisherCollectionForm from "@/components/Forms/AddPublisherCollectionForm/AddPublisherCollectionForm";
import { useEffect } from "react";
import { getPublisherCollections } from "@/backend/api/publisherCollection";
import { SECTION_TYPE_GRANULARITY } from "node_modules/@mui/x-date-pickers/esm/internals/utils/getDefaultReferenceDate";

type PublisherCollectionAutocompleteProps = 
    Omit<StandardAutocompleteProps<CreatedPublisherCollection>, 'options' | 'getOptionLabel' | 'isOptionEqualToValue'>

const PublisherCollectionAutocomplete = (props: PublisherCollectionAutocompleteProps) => {
    const [collections, setCollections] = useCollections()
    useEffect(() => {
        getPublisherCollections((collections) => {
            console.debug("Got the Collections ", collections)
            setCollections(collections)
        })
    }, [])
    const createOption : StandardAutocompleteProps<CreatedPublisherCollection>['createOption']  = {
        id: 0,
        name: 'Add New Collection' 
    } 
    return <StandardAutocomplete<CreatedPublisherCollection, Partial<NewPublisherCollection>>
        options={collections}
        getOptionLabel={collection => `${collection.name} ${collection?.publisher ? `- ${collection.publisher.name}` : '' }`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={props.onChange}
        createOption={createOption}
        CreateOptionForm={AddPublisherCollectionForm}
        getOptionKey={option => option.id.toString()}
        getPrepopulatedInput={state => ({name: state.inputValue, publisherId: state.value?.id, language: state.value?.language })}
        label="Collection"
    />
}

export default PublisherCollectionAutocomplete