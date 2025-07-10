import axios from "axios";
import { CustomError, MissingParamError } from "../common/utils.js";

/**
 * WakaTime data fetcher.
 *
 * @param {{username: string, api_domain: string }} props Fetcher props.
 * @returns {Promise<WakaTimeData>} WakaTime data response.
 */
const fetchWakatimeStats = async ({ username, api_domain }) => {
  if (!username) {
    throw new MissingParamError(["username"]);
  }

  // Allow-list for trusted API domains
  const allowedDomains = ["wakatime.com", "api.wakatime.com"];
  const sanitizedDomain = api_domain
    ? api_domain.replace(/\/$/gi, "")
    : "wakatime.com";

alert-autofix-3
  let host;
  try {
    host = new URL(`https://${sanitizedDomain}`).host;
  } catch (err) {
    throw new CustomError(
      `Invalid API domain: '${sanitizedDomain}'`,
      "INVALID_API_DOMAIN",
    );
  }

  const isAllowedDomain = allowedDomains.some(
    (allowedDomain) =>
      host === allowedDomain || host.endsWith(`.${allowedDomain}`)
  );

  // Ensure host matches or is a subdomain of an allowed domain

  if (!isAllowedDomain) {
    throw new CustomError(
      `Invalid API domain: '${sanitizedDomain}'`,
      "INVALID_API_DOMAIN",
    );
  }

  // Sanitize username to prevent malicious input
  const sanitizedUsername = encodeURIComponent(username);

  try {
    const { data } = await axios.get(
      `https://${sanitizedDomain}/api/v1/users/${sanitizedUsername}/stats?is_including_today=true`,
    );

    return data.data;
  } catch (err) {
    if (err.response.status < 200 || err.response.status > 299) {
      throw new CustomError(
        `Could not resolve to a User with the login of '${username}'`,
        "WAKATIME_USER_NOT_FOUND",
      );
    }
    throw err;
  }
};

export { fetchWakatimeStats };
export default fetchWakatimeStats;
