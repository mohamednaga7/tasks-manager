import Cookies from 'js-cookie';

const SESSION_COOKIE_NAME = `${window.location.origin}-sid`;

export const getAuthCookie = () => Cookies.get(SESSION_COOKIE_NAME);

export const clearAuthCookie = () => Cookies.remove(SESSION_COOKIE_NAME);
