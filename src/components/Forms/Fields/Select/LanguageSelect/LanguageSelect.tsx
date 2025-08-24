import { supportedLanguages } from "@/types/enums/supportedLanguage"
import StandardSelect, {StandardSelectProps} from "../StandardSelect/StandardSelect"

type LanguageSelectOption = {
  label: string,
  value: string
}

type LanguageSelectProps = Partial<StandardSelectProps<LanguageSelectOption, false>>

const LanguageSelect = (props : LanguageSelectProps) => {
  const displayLangName = new Intl.DisplayNames([navigator.language || 'en'], {type: 'language'})
  
  const options : LanguageSelectOption[] = props.options ?? supportedLanguages.map(code => ({
    label: displayLangName.of(code) ?? code,
    value: code
    }))
  
  const defaultValue : LanguageSelectOption = props.defaultValue ?? {label: displayLangName.of('fr') ?? 'fr', value: 'fr'}

  return <StandardSelect<LanguageSelectOption, false>
      options={options}
      defaultValue={defaultValue}
      multiple={false}
      onChange={props.onChange}
      textInputLabel={props.textInputLabel ?? 'Select a language'}
      required={props.required}
    />
}

export default LanguageSelect