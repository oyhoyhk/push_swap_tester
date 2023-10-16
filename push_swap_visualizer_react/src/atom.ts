import { atom } from 'recoil';
import { IModalInfo } from './interface';

export const modalInfoState = atom<IModalInfo | null>({
	key: 'modalInfoState',
	default: null,
});

export const countryInfoState = atom<string>({
	key: 'countryState',
	default: '',
});
