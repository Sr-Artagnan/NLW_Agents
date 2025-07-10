import lib from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'

lib.extend(relativeTime)
lib.locale('pt-br')

export const dayjs = lib