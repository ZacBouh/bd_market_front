import { supportedOnGoingStatus, onGoingStatusLabel, SupportedOnGoingStatus } from "@/types/enums/onGoingStatus"
import StandardSelect, {StandardSelectProps} from "../StandardSelect/StandardSelect"

type OnGoingStatusOption<T extends SupportedOnGoingStatus = SupportedOnGoingStatus> = {
  label: typeof onGoingStatusLabel[T],
  value: T
}

type OnGoingStatusProps<T extends SupportedOnGoingStatus = SupportedOnGoingStatus> = Partial<StandardSelectProps<OnGoingStatusOption<T>, false>>

const OnGoingStatusSelect = <T extends SupportedOnGoingStatus = SupportedOnGoingStatus>(props : OnGoingStatusProps<T>) => {
  
  const options : OnGoingStatusOption<T>[]  = props.options as OnGoingStatusOption<T>[] ?? supportedOnGoingStatus.map(statusCode => ({
    label: onGoingStatusLabel[statusCode] ,
    value: statusCode
    }))
  
  const defaultValue : OnGoingStatusOption<T> = props.defaultValue as OnGoingStatusOption<T> ?? {label: onGoingStatusLabel.ongoing, value: 'ongoing'}

  return <StandardSelect<OnGoingStatusOption<T>, false>
      options={options}
      defaultValue={defaultValue}
      multiple={false}
      onChange={props.onChange}
      textInputLabel={props.textInputLabel ?? 'On going status'}
      required={props.required}
    />
}

export default OnGoingStatusSelect