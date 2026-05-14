import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core/index.js'
import OasModule from 'oas';
import APICoreModule from 'api/dist/core/index.js';
import definition from './openapi.json' with { type: 'json' };

const Oas = (OasModule as any).default || OasModule;
const APICore = (APICoreModule as any).default || APICoreModule;

class SDK {
  spec: any;
  core: any;

  constructor() {
    this.spec = Oas.init ? Oas.init(definition) : new Oas(definition);
    this.core = new APICore(this.spec, 'acculynxapi/2.2607.0 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Use this endpoint to get a listing of the countries supported by AccuLynx. <br />
   * Supported includes values: states
   *
   * @summary Get AccuLynx Countries
   * @throws FetchError<401, types.GetAccuLynxCountriesResponse401> API Key is invalid or deactivated
   */
  getAccuLynxCountries(metadata?: types.GetAccuLynxCountriesMetadataParam): Promise<FetchResponse<200, types.GetAccuLynxCountriesResponse200>> {
    return this.core.fetch('/acculynx/countries', 'get', metadata);
  }

  /**
   * Use this endpoint to get a specific country. <br /> Supported includes values: states
   *
   * @summary Get an AccuLynx Country
   * @throws FetchError<400, types.GetAccuLynxCountryResponse400> Bad Request
   * @throws FetchError<401, types.GetAccuLynxCountryResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetAccuLynxCountryResponse404> Requested resource does not exist.
   */
  getAccuLynxCountry(metadata: types.GetAccuLynxCountryMetadataParam): Promise<FetchResponse<200, types.GetAccuLynxCountryResponse200>> {
    return this.core.fetch('/acculynx/countries/{countryId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get the states supported by AccuLynx for a country. <br />
   * Supported includes values: states
   *
   * @summary Get States
   * @throws FetchError<400, types.GetAccuLynxStatesResponse400> Bad Request
   * @throws FetchError<401, types.GetAccuLynxStatesResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetAccuLynxStatesResponse404> Requested resource does not exist.
   */
  getAccuLynxStates(metadata: types.GetAccuLynxStatesMetadataParam): Promise<FetchResponse<200, types.GetAccuLynxStatesResponse200>> {
    return this.core.fetch('/acculynx/countries/{countryId}/states', 'get', metadata);
  }

  /**
   * Use this endpoint to get a specific state within a specific country. <br />
   *
   * @summary Get a particular state
   * @throws FetchError<400, types.GetAccuLynxStateResponse400> Bad Request
   * @throws FetchError<401, types.GetAccuLynxStateResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetAccuLynxStateResponse404> Requested resource does not exist.
   */
  getAccuLynxState(metadata: types.GetAccuLynxStateMetadataParam): Promise<FetchResponse<200, types.GetAccuLynxStateResponse200>> {
    return this.core.fetch('/acculynx/countries/{countryId}/states/{stateId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get the list of the catalog units of measure.
   *
   * @summary Get units of measure
   * @throws FetchError<401, types.GetAcculynxUnitsOfMeasureResponse401> API Key is invalid or deactivated
   */
  getAcculynxUnitsOfMeasure(): Promise<FetchResponse<200, types.GetAcculynxUnitsOfMeasureResponse200>> {
    return this.core.fetch('/acculynx/units-of-measure', 'get');
  }

  /**
   * Use this endpoint to get a list of calendars for the location. This endpoint will return
   * a paginated response starting from the given record index.
   *
   * @summary Calendar List
   * @throws FetchError<400, types.GetCalendarsResponse400> Bad Request
   * @throws FetchError<401, types.GetCalendarsResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetCalendarsResponse416> The range of data requested from the resource is invalid
   */
  getCalendars(metadata?: types.GetCalendarsMetadataParam): Promise<FetchResponse<200, types.GetCalendarsResponse200>> {
    return this.core.fetch('/calendars', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of appointments for the specified calendar. The request
   * range should not exceed 90 days.
   *
   * @summary Calendar Appointments Summary
   */
  getAppointments(metadata: types.GetAppointmentsMetadataParam): Promise<FetchResponse<200, types.GetAppointmentsResponse200>> {
    return this.core.fetch('/calendars/{calendarId}/appointments', 'get', metadata);
  }

  /**
   * Use this endpoint to get the appointment details for a specific calendar event.
   *
   * @summary Get Appointment Details
   * @throws FetchError<401, types.GetAppointmentByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetAppointmentByIdResponse404> Requested resource does not exist.
   */
  getAppointmentById(metadata: types.GetAppointmentByIdMetadataParam): Promise<FetchResponse<200, types.GetAppointmentByIdResponse200>> {
    return this.core.fetch('/calendars/{calendarId}/appointments/{appointmentId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of settings for the current location.
   *
   * @summary Get Company Settings.
   * @throws FetchError<401, types.GetCompanySettingsResponse401> API Key is invalid or deactivated
   */
  getCompanySettings(): Promise<FetchResponse<200, types.GetCompanySettingsResponse200>> {
    return this.core.fetch('/company-settings', 'get');
  }

  /**
   * Use this endpoint to retrieve custom field definitions and the options related to each
   * custom field definition by company.  Returns Custom Field Definitions for types
   * "contact" and "job" with only active status. Includes field options with active status
   * by default. Custom Field Definitions are returned by grouped by field type . StartIndex
   * starts at 0. Default PageSize is 25. Pagination parameters are optional. You can filter
   * by type 'jobs' or 'contacts'. By default both filters are included. `e.g. ?filter=jobs`.
   *  Valid includes are 'user'. `e.g. ?includes=user`
   *
   * @summary Get Custom Field Definitions
   * @throws FetchError<400, types.GetCompanySettingsCustomFieldsResponse400> Bad Request
   * @throws FetchError<401, types.GetCompanySettingsCustomFieldsResponse401> API Key is invalid or deactivated
   * @throws FetchError<403, types.GetCompanySettingsCustomFieldsResponse403> Not enough permissions.
   * @throws FetchError<416, types.GetCompanySettingsCustomFieldsResponse416> The range of data requested from the resource is invalid
   */
  getCompanySettingsCustomFields(metadata?: types.GetCompanySettingsCustomFieldsMetadataParam): Promise<FetchResponse<200, types.GetCompanySettingsCustomFieldsResponse200>> {
    return this.core.fetch('/company-settings/custom-fields', 'get', metadata);
  }

  /**
   * Use this endpoint to get the document folders for a company.  This endpoint will return
   * a paginated response starting from the given record index.
   *
   * @summary Get Documents Folders
   * @throws FetchError<400, types.GetCompanyDocumentFoldersResponse400> Bad Request
   * @throws FetchError<401, types.GetCompanyDocumentFoldersResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetCompanyDocumentFoldersResponse416> The range of data requested from the resource is invalid
   */
  getCompanyDocumentFolders(metadata?: types.GetCompanyDocumentFoldersMetadataParam): Promise<FetchResponse<200, types.GetCompanyDocumentFoldersResponse200>> {
    return this.core.fetch('/company-settings/job-file-settings/document-folders', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of the photo and video tags for the current location. 
   * The response is paginated based on the pageSize and StartIndex query parameters starting
   * from the given record index and sorted by based on tag name in the order given by the
   * sortOrder query parameter.  All the query parameters are optional.  pageSize defaults to
   * 50.
   *
   * @summary Get Company Photo and Video Tags.
   * @throws FetchError<400, types.GetPhotoVideoTagsResponse400> Bad Request
   * @throws FetchError<401, types.GetPhotoVideoTagsResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetPhotoVideoTagsResponse416> The range of data requested from the resource is invalid
   */
  getPhotoVideoTags(metadata?: types.GetPhotoVideoTagsMetadataParam): Promise<FetchResponse<200, types.GetPhotoVideoTagsResponse200>> {
    return this.core.fetch('/company-settings/job-file-settings/photo-video-tags', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of 'active' Account Types for the current company.
   *
   * @summary Get Company Active Account Types.
   * @throws FetchError<400, types.GetActiveAccountTypesResponse400> Bad Request
   * @throws FetchError<401, types.GetActiveAccountTypesResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetActiveAccountTypesResponse404> Requested resource does not exist.
   */
  getActiveAccountTypes(): Promise<FetchResponse<200, types.GetActiveAccountTypesResponse200>> {
    return this.core.fetch('/company-settings/location-settings/account-types', 'get');
  }

  /**
   * Use this endpoint to get an account type by id.
   *
   * @summary Get Company Active Account Type  by id.
   * @throws FetchError<400, types.GetAccountTypeByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetAccountTypeByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetAccountTypeByIdResponse404> Requested resource does not exist.
   */
  getAccountTypeById(metadata: types.GetAccountTypeByIdMetadataParam): Promise<FetchResponse<200, types.GetAccountTypeByIdResponse200>> {
    return this.core.fetch('/company-settings/location-settings/account-types/{accountTypeId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of countries supported by the current company. This
   * endpoint will return a paginated response starting from the given record index.
   *
   * @summary Get Company Countries
   * @throws FetchError<400, types.GetCompanySettingsLocationSettingsCountriesResponse400> Bad Request
   * @throws FetchError<401, types.GetCompanySettingsLocationSettingsCountriesResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetCompanySettingsLocationSettingsCountriesResponse416> The range of data requested from the resource is invalid
   */
  getCompanySettingsLocationSettingsCountries(metadata?: types.GetCompanySettingsLocationSettingsCountriesMetadataParam): Promise<FetchResponse<200, types.GetCompanySettingsLocationSettingsCountriesResponse200>> {
    return this.core.fetch('/company-settings/location-settings/countries', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of the states supported by the current company.
   * CountryId must be an existing country supported by the current company. This endpoint
   * will return a paginated response starting from the given record index. StartIndex starts
   * at 0. Default PageSize is 100. Pagination parameters are optional.
   *
   * @summary Get Company States
   * @throws FetchError<400, types.GetcompanySettingsLocationSettingsCountriesCountryIdStatesResponse400> Bad Request
   * @throws FetchError<401, types.GetcompanySettingsLocationSettingsCountriesCountryIdStatesResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetcompanySettingsLocationSettingsCountriesCountryIdStatesResponse404> Requested resource does not exist.
   * @throws FetchError<416, types.GetcompanySettingsLocationSettingsCountriesCountryIdStatesResponse416> The range of data requested from the resource is invalid
   */
  getcompanySettingsLocationSettingsCountriesCountryIdStates(metadata: types.GetcompanySettingsLocationSettingsCountriesCountryIdStatesMetadataParam): Promise<FetchResponse<200, types.GetcompanySettingsLocationSettingsCountriesCountryIdStatesResponse200>> {
    return this.core.fetch('/company-settings/location-settings/countries/{countryId}/states', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of insurance companies for the current location.  The
   * response is paginated based on the pageSize and StartIndex query parameters and sorted
   * by based on tag name in the order given by the sortOrder query parameter.  All the query
   * parameters are optional.  pageSize defaults to 50 and StartIndex defaults to 0.
   *
   * @summary Get Insurance Companies.
   * @throws FetchError<401, types.GetInsuranceCompaniesResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetInsuranceCompaniesResponse416> The range of data requested from the resource is invalid
   */
  getInsuranceCompanies(metadata?: types.GetInsuranceCompaniesMetadataParam): Promise<FetchResponse<200, types.GetInsuranceCompaniesResponse200>> {
    return this.core.fetch('/company-settings/job-file-settings/insurance-companies', 'get', metadata);
  }

  /**
   * Use this endpoint to get all the Job Categories for a company.  StartIndex starts at 0.
   * Default PageSize is 25. Pagination parameters are optional. Only active job category
   * values are returned.
   *
   * @summary Get Job Categories of the company.
   * @throws FetchError<401, types.GetCompanySettingsJobSettingsJobCategoriesResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetCompanySettingsJobSettingsJobCategoriesResponse416> The range of data requested from the resource is invalid
   */
  getCompanySettingsJobSettingsJobCategories(metadata?: types.GetCompanySettingsJobSettingsJobCategoriesMetadataParam): Promise<FetchResponse<200, types.GetCompanySettingsJobSettingsJobCategoriesResponse200>> {
    return this.core.fetch('/company-settings/job-file-settings/job-categories', 'get', metadata);
  }

  /**
   * Use this endpoint to get all the Trade Types for a company.  StartIndex starts at 0.
   * Default PageSize is 25. Pagination parameters are optional. This endpoint will return a
   * paginated response starting from the given record index. Only active trade type values
   * are returned.
   *
   * @summary Get Trade Types of the company.
   * @throws FetchError<401, types.GetCompanySettingsJobSettingsTradeTypesResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetCompanySettingsJobSettingsTradeTypesResponse416> The range of data requested from the resource is invalid
   */
  getCompanySettingsJobSettingsTradeTypes(metadata?: types.GetCompanySettingsJobSettingsTradeTypesMetadataParam): Promise<FetchResponse<200, types.GetCompanySettingsJobSettingsTradeTypesResponse200>> {
    return this.core.fetch('/company-settings/job-file-settings/trade-types', 'get', metadata);
  }

  /**
   * Use this endpoint to get all the Work Types for a company.  StartIndex starts at 0.
   * Default PageSize is 100.  Pagination parameters are optional. Only active work type
   * values are returned.
   *
   * @summary Get Work Types of a company.
   * @throws FetchError<400, types.GetCompanySettingsJobSettingsWorkTypesResponse400> Bad Request
   * @throws FetchError<401, types.GetCompanySettingsJobSettingsWorkTypesResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetCompanySettingsJobSettingsWorkTypesResponse416> The range of data requested from the resource is invalid
   */
  getCompanySettingsJobSettingsWorkTypes(metadata?: types.GetCompanySettingsJobSettingsWorkTypesMetadataParam): Promise<FetchResponse<200, types.GetCompanySettingsJobSettingsWorkTypesResponse200>> {
    return this.core.fetch('/company-settings/job-file-settings/work-types', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of active lead sources for the current location. This
   * will return the complete lead sources list available for the current location. Inactive
   * lead sources won't be returned.  StartIndex starts at 0. Default PageSize is 25.
   * Pagination parameters are optional.
   *
   * @summary Get Active Lead Sources for a company.
   * @throws FetchError<400, types.GetActiveLeadSourcesResponse400> Bad Request
   * @throws FetchError<401, types.GetActiveLeadSourcesResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetActiveLeadSourcesResponse416> The range of data requested from the resource is invalid
   */
  getActiveLeadSources(metadata?: types.GetActiveLeadSourcesMetadataParam): Promise<FetchResponse<200, types.GetActiveLeadSourcesResponse200>> {
    return this.core.fetch('/company-settings/leads/lead-sources', 'get', metadata);
  }

  /**
   * Use this endpoint to get a lead source for the current location. This will return a lead
   * source available for the current location.
   *
   * @summary Get Company Lead Source by Id.
   * @throws FetchError<400, types.GetLeadSourceByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetLeadSourceByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetLeadSourceByIdResponse404> Requested resource does not exist.
   */
  getLeadSourceById(metadata: types.GetLeadSourceByIdMetadataParam): Promise<FetchResponse<200, types.GetLeadSourceByIdResponse200>> {
    return this.core.fetch('/company-settings/leads/lead-sources/{leadSourceId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get a child lead source for the current location. This will return
   * a child lead source available for the current location.
   *
   * @summary Get Company Child Lead Source by Id.
   * @throws FetchError<400, types.GetLeadSourceChildByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetLeadSourceChildByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetLeadSourceChildByIdResponse404> Requested resource does not exist.
   */
  getLeadSourceChildById(metadata: types.GetLeadSourceChildByIdMetadataParam): Promise<FetchResponse<200, types.GetLeadSourceChildByIdResponse200>> {
    return this.core.fetch('/company-settings/leads/lead-sources/{leadSourceParentId}/children/{leadSourceId}', 'get', metadata);
  }

  /**
   * Get milestones related to company. For including statuses, the company must have enabled
   * custom workflows. 
   * Valid include value is: status.
   *
   * @summary Get milestones
   * @throws FetchError<400, types.GetMilestonesResponse400> Bad Request
   * @throws FetchError<401, types.GetMilestonesResponse401> API Key is invalid or deactivated
   * @throws FetchError<403, types.GetMilestonesResponse403> Not enough permissions.
   * @throws FetchError<404, types.GetMilestonesResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.GetMilestonesResponse412> The request could not be completed due to the failure of a required precondition.
   */
  getMilestones(metadata?: types.GetMilestonesMetadataParam): Promise<FetchResponse<200, types.GetMilestonesResponse200>> {
    return this.core.fetch('/company-settings/job-file-settings/workflow-milestones', 'get', metadata);
  }

  /**
   * Get statuses for a milestone.
   *
   * @summary Get statuses for a milestone
   * @throws FetchError<400, types.GetStatusesForMilestoneResponse400> Bad Request
   * @throws FetchError<401, types.GetStatusesForMilestoneResponse401> API Key is invalid or deactivated
   * @throws FetchError<403, types.GetStatusesForMilestoneResponse403> Not enough permissions.
   * @throws FetchError<404, types.GetStatusesForMilestoneResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.GetStatusesForMilestoneResponse412> The request could not be completed due to the failure of a required precondition.
   */
  getStatusesForMilestone(metadata: types.GetStatusesForMilestoneMetadataParam): Promise<FetchResponse<200, types.GetStatusesForMilestoneResponse200>> {
    return this.core.fetch('/company-settings/job-file-settings/workflow-milestones/{milestone}/statuses', 'get', metadata);
  }

  /**
   * Use this endpoint to get a listing of Contacts.  <br/>supported includes values:
   * emailAddress, phoneNumber.
   *
   * @summary Contacts Summary
   * @throws FetchError<400, types.GetContactsResponse400> Bad Request
   * @throws FetchError<401, types.GetContactsResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetContactsResponse416> The range of data requested from the resource is invalid
   */
  getContacts(metadata?: types.GetContactsMetadataParam): Promise<FetchResponse<200, types.GetContactsResponse200>> {
    return this.core.fetch('/contacts', 'get', metadata);
  }

  /**
   * Use this endpoint to create a new contact
   *
   * @summary Create Contact
   * @throws FetchError<400, types.PostContactsResponse400> Bad Request
   * @throws FetchError<401, types.PostContactsResponse401> API Key is invalid or deactivated
   */
  postContacts(body?: types.PostContactsBodyParam): Promise<FetchResponse<201, types.PostContactsResponse201>> {
    return this.core.fetch('/contacts', 'post', body);
  }

  /**
   * Use this endpoint to get the list of contact types from a company.
   *
   * @summary Get the contact types
   * @throws FetchError<401, types.GetContactTypesResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetContactTypesResponse416> The range of data requested from the resource is invalid
   */
  getContactTypes(metadata?: types.GetContactTypesMetadataParam): Promise<FetchResponse<200, types.GetContactTypesResponse200>> {
    return this.core.fetch('/contacts/contact-types', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of contacts matching the given search criteria. 
   * Contacts are returned if they include a given first name, last name, company name, and
   * contact type. it will filter by range of dates, using the CreationDate of the contact.
   * <br/><br/>The size of the return is controlled with the pageSize query parameter which
   * defaults to 25 and must be > 0 and <= 25.  Set pageIndex > 0 to access contacts past the
   * first page when more than pageSize contacts meet the search criteria. <br/>Sort
   * criteria, startDate and endDate are required. <br/><br/> The search returns includes
   * like phone numbers, email addresses and location address.
   *
   * @summary Contacts Search.
   * @throws FetchError<400, types.PostContactSearchResponse400> Bad Request
   * @throws FetchError<401, types.PostContactSearchResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.PostContactSearchResponse416> The range of data requested from the resource is invalid
   */
  postContactSearch(body: types.PostContactSearchBodyParam, metadata?: types.PostContactSearchMetadataParam): Promise<FetchResponse<200, types.PostContactSearchResponse200>> {
    return this.core.fetch('/contacts/search', 'post', body, metadata);
  }

  /**
   * Use this endpoint to get details for a specific contact. <br/>supported includes values:
   * emailAddress, phoneNumber.
   *
   * @summary Get Contact by Id.
   * @throws FetchError<400, types.GetContactResponse400> Bad Request
   * @throws FetchError<401, types.GetContactResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetContactResponse404> Requested resource does not exist.
   */
  getContact(metadata: types.GetContactMetadataParam): Promise<FetchResponse<200, types.GetContactResponse200>> {
    return this.core.fetch('/contacts/{contactId}', 'get', metadata);
  }

  /**
   * Get a list of all custom fields related to a specific contact by its contact Id. This
   * endpoint will return a paginated response starting from the given record index.
   * StartIndex starts at 0. Default PageSize is 25. Pagination parameters are optional.
   *
   * @summary Retrieve all custom fields for a contact by id.
   * @throws FetchError<400, types.GetContactCustomFieldsResponse400> Bad Request
   * @throws FetchError<401, types.GetContactCustomFieldsResponse401> API Key is invalid or deactivated
   * @throws FetchError<403, types.GetContactCustomFieldsResponse403> Not enough permissions.
   * @throws FetchError<404, types.GetContactCustomFieldsResponse404> Requested resource does not exist.
   */
  getContactCustomFields(metadata: types.GetContactCustomFieldsMetadataParam): Promise<FetchResponse<200, types.GetContactCustomFieldsResponse200>> {
    return this.core.fetch('/contacts/{contactId}/custom-fields', 'get', metadata);
  }

  /**
   * Use this endpoint to update multiple custom field values for a contact.
   * The limit of the Custom Field list to update cannot be greater than 120.
   * If the custom field type is Text, the maximum lenght of the text is 500 characters. 
   * Any text beyond that limit will be truncated.
   *
   * @summary Sets multiple custom field values for a contact by id
   * @throws FetchError<400, types.PutContactCustomFieldsResponse400> Bad Request
   * @throws FetchError<401, types.PutContactCustomFieldsResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PutContactCustomFieldsResponse404> Requested resource does not exist.
   * @throws FetchError<416, types.PutContactCustomFieldsResponse416> The range of data requested from the resource is invalid
   */
  putContactCustomFields(body: types.PutContactCustomFieldsBodyParam, metadata: types.PutContactCustomFieldsMetadataParam): Promise<FetchResponse<number, unknown>>;
  putContactCustomFields(metadata: types.PutContactCustomFieldsMetadataParam): Promise<FetchResponse<number, unknown>>;
  putContactCustomFields(body?: types.PutContactCustomFieldsBodyParam | types.PutContactCustomFieldsMetadataParam, metadata?: types.PutContactCustomFieldsMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/contacts/{contactId}/custom-fields', 'put', body, metadata);
  }

  /**
   * Get a custom field object inside a contact provided a custom field id and a valid
   * contact id
   *
   * @summary Retrieve a specific custom field for a contact by id
   * @throws FetchError<400, types.GetContactCustomFieldByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetContactCustomFieldByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<403, types.GetContactCustomFieldByIdResponse403> Not enough permissions.
   * @throws FetchError<404, types.GetContactCustomFieldByIdResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.GetContactCustomFieldByIdResponse412> The request could not be completed due to the failure of a required precondition.
   */
  getContactCustomFieldById(metadata: types.GetContactCustomFieldByIdMetadataParam): Promise<FetchResponse<200, types.GetContactCustomFieldByIdResponse200>> {
    return this.core.fetch('/contacts/{contactId}/custom-fields/{customFieldId}', 'get', metadata);
  }

  /**
   * Sets a value for the specified custom field in the contact
   * If the custom field type is Text, the maximum lenght of the text is 500 characters. 
   * Any text beyond that limit will be truncated.
   *
   * @summary Sets a value for a specific custom field for a contact by id
   * @throws FetchError<400, types.PutContactCustomFieldByIdResponse400> Bad Request
   * @throws FetchError<401, types.PutContactCustomFieldByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PutContactCustomFieldByIdResponse404> Requested resource does not exist.
   */
  putContactCustomFieldById(body: types.PutContactCustomFieldByIdBodyParam, metadata: types.PutContactCustomFieldByIdMetadataParam): Promise<FetchResponse<number, unknown>>;
  putContactCustomFieldById(metadata: types.PutContactCustomFieldByIdMetadataParam): Promise<FetchResponse<number, unknown>>;
  putContactCustomFieldById(body?: types.PutContactCustomFieldByIdBodyParam | types.PutContactCustomFieldByIdMetadataParam, metadata?: types.PutContactCustomFieldByIdMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/contacts/{contactId}/custom-fields/{customFieldId}', 'put', body, metadata);
  }

  /**
   * Use this endpoint to get the list of email addresses for a specific contact.
   *
   * @summary Get Email Address List.
   * @throws FetchError<400, types.GetContactEmailAddressesResponse400> Bad Request
   * @throws FetchError<401, types.GetContactEmailAddressesResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetContactEmailAddressesResponse404> Requested resource does not exist.
   */
  getContactEmailAddresses(metadata: types.GetContactEmailAddressesMetadataParam): Promise<FetchResponse<200, types.GetContactEmailAddressesResponse200>> {
    return this.core.fetch('/contacts/{contactId}/email-addresses', 'get', metadata);
  }

  /**
   * Use this endpoint to get the email addresses for a specific emailId associated with a
   * specific contact.
   *
   * @summary Get Email Address.
   * @throws FetchError<400, types.GetContactEmailAddressByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetContactEmailAddressByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetContactEmailAddressByIdResponse404> Requested resource does not exist.
   */
  getContactEmailAddressById(metadata: types.GetContactEmailAddressByIdMetadataParam): Promise<FetchResponse<200, types.GetContactEmailAddressByIdResponse200>> {
    return this.core.fetch('/contacts/{contactId}/email-addresses/{emailId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get the list of phone numbers for a specific contact.
   *
   * @summary Get Phone Number List.
   * @throws FetchError<400, types.GetContactPhoneNumberResponse400> Bad Request
   * @throws FetchError<401, types.GetContactPhoneNumberResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetContactPhoneNumberResponse404> Requested resource does not exist.
   */
  getContactPhoneNumber(metadata: types.GetContactPhoneNumberMetadataParam): Promise<FetchResponse<200, types.GetContactPhoneNumberResponse200>> {
    return this.core.fetch('/contacts/{contactId}/phone-numbers', 'get', metadata);
  }

  /**
   * Use this endpoint to add a phone number to the list of phone numbers for a specific
   * contact.
   *
   * @summary Add Phone Numbers
   * @throws FetchError<400, types.PostContactPhoneNumberResponse400> Bad Request
   * @throws FetchError<401, types.PostContactPhoneNumberResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostContactPhoneNumberResponse404> Requested resource does not exist.
   */
  postContactPhoneNumber(body: types.PostContactPhoneNumberBodyParam, metadata: types.PostContactPhoneNumberMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/contacts/{contactId}/phone-numbers', 'post', body, metadata);
  }

  /**
   * Use this endpoint to get the phone number for a specific phoneId associated with a
   * specific contact.
   *
   * @summary Get a phone number
   * @throws FetchError<400, types.GetContactPhoneNumberByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetContactPhoneNumberByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetContactPhoneNumberByIdResponse404> Requested resource does not exist.
   */
  getContactPhoneNumberById(metadata: types.GetContactPhoneNumberByIdMetadataParam): Promise<FetchResponse<200, types.GetContactPhoneNumberByIdResponse200>> {
    return this.core.fetch('/contacts/{contactId}/phone-numbers/{phoneId}', 'get', metadata);
  }

  /**
   * Use this endpoint to create a new Log for an existing contact
   *
   * @summary Create Contact - Log
   * @throws FetchError<400, types.PostContactLogResponse400> Bad Request
   * @throws FetchError<401, types.PostContactLogResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostContactLogResponse404> Requested resource does not exist.
   */
  postContactLog(body: types.PostContactLogBodyParam, metadata: types.PostContactLogMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/contacts/{contactId}/logs', 'post', body, metadata);
  }

  /**
   * Use this endpoint to verify that the API server is responsive.
   *
   * @summary Check if the API server is responsive
   * @throws FetchError<400, types.GetPingResponse400> Bad Request
   */
  getPing(): Promise<FetchResponse<200, types.GetPingResponse200>> {
    return this.core.fetch('/diagnostics/ping', 'get');
  }

  /**
   * Use this endpoint to get all estimates for the current location. <br /> Supported
   * includes values: job
   *
   * @summary Get Estimates
   * @throws FetchError<400, types.GetEstimatesResponse400> Bad Request
   * @throws FetchError<401, types.GetEstimatesResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetEstimatesResponse416> The range of data requested from the resource is invalid
   */
  getEstimates(metadata?: types.GetEstimatesMetadataParam): Promise<FetchResponse<200, types.GetEstimatesResponse200>> {
    return this.core.fetch('/estimates', 'get', metadata);
  }

  /**
   * Use this endpoint to get a specific estimate. <br /> Supported includes values: job,
   * createdBy, modifiedBy, sections
   *
   * @summary Get Estimate
   * @throws FetchError<400, types.GetEstimateByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetEstimateByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetEstimateByIdResponse404> Requested resource does not exist.
   */
  getEstimateById(metadata: types.GetEstimateByIdMetadataParam): Promise<FetchResponse<200, types.GetEstimateByIdResponse200>> {
    return this.core.fetch('/estimates/{estimateId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get all sections for the given estimate. <br /> Supported includes
   * values: createdBy, modifiedBy, items
   *
   * @summary Get Estimate Sections
   * @throws FetchError<400, types.GetEstimateSectionsResponse400> Bad Request
   * @throws FetchError<401, types.GetEstimateSectionsResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetEstimateSectionsResponse404> Requested resource does not exist.
   */
  getEstimateSections(metadata: types.GetEstimateSectionsMetadataParam): Promise<FetchResponse<200, types.GetEstimateSectionsResponse200>> {
    return this.core.fetch('/estimates/{estimateId}/sections', 'get', metadata);
  }

  /**
   * Use this endpoint to get a specific estimate section. <br /> Supported includes values:
   * createdBy, modifiedBy, items
   *
   * @summary Get Estimate Section
   * @throws FetchError<400, types.GetEstimateSectionByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetEstimateSectionByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetEstimateSectionByIdResponse404> Requested resource does not exist.
   */
  getEstimateSectionById(metadata: types.GetEstimateSectionByIdMetadataParam): Promise<FetchResponse<200, types.GetEstimateSectionByIdResponse200>> {
    return this.core.fetch('/estimates/{estimateId}/sections/{estimateSectionId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get all items for the given estimate section.
   *
   * @summary Get Estimate Section Items
   * @throws FetchError<400, types.GetEstimateSectionItemsResponse400> Bad Request
   * @throws FetchError<401, types.GetEstimateSectionItemsResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetEstimateSectionItemsResponse404> Requested resource does not exist.
   */
  getEstimateSectionItems(metadata: types.GetEstimateSectionItemsMetadataParam): Promise<FetchResponse<200, types.GetEstimateSectionItemsResponse200>> {
    return this.core.fetch('/estimates/{estimateId}/sections/{estimateSectionId}/items', 'get', metadata);
  }

  /**
   * Use this endpoint to get a specific estimate item.
   *
   * @summary Get Estimate Section Item
   * @throws FetchError<400, types.GetEstimateSectionItemResponse400> Bad Request
   * @throws FetchError<401, types.GetEstimateSectionItemResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetEstimateSectionItemResponse404> Requested resource does not exist.
   */
  getEstimateSectionItem(metadata: types.GetEstimateSectionItemMetadataParam): Promise<FetchResponse<200, types.GetEstimateSectionItemResponse200>> {
    return this.core.fetch('/estimates/{estimateId}/sections/{estimateSectionId}/items/{estimateItemId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get a listing of Jobs.
   *
   * When startDate and endDate are specified, jobs returned will be filtered to the given
   * date range (inclusive).
   *
   * The date field to filter on is given with dateFilterType which defaults to CreatedDate.
   *
   * Optionally use milestones to limit the jobs to those in the listed milestones.
   *
   * Optionally use sortBy to sort jobs by either CreatedDate, MilestoneDate, or
   * ModifiedDate. CreatedDate is the default.
   *
   * Optionally use sortOrder to indicate newest to oldest (Descending) ordering or oldest to
   * newest (Ascending) ordering. Ascending is the default.
   *
   * The pageStartIndex parameter to start looking for records should not exceed 100000
   *
   * **To Get Jobs:**
   *
   * Supported includes values: contact, initalAppointment.
   *
   * Example: return the jobs (including initial appointment) that are prospects and were
   * modified in April sorted most recent first (descending ModifiedDate)
   *
   * *\/jobs?pageSize=25&includes=initialAppointment&filterByDate=ModifiedDate&startDate=2021-04-01&endDate=2021-04-30&sortBy=ModifiedDate&sortOrder=Descending*
   *
   *
   * **To Get Unassigned Jobs:**
   *
   * Supported includes values: contact.
   *
   * Example: return the unassigned jobs (including contacts) that were modified in March
   * sorted most recent first (descending ModifiedDate)
   *
   * *\/jobs?assignment=unassigned&pageSize=25&includes=contacts&filterByDate=ModifiedDate&startDate=2025-03-01&endDate=2025-03-30&sortBy=ModifiedDate&sortOrder=Descending*
   *
   * *jobs?assignment=unassigned&milestones=Lead&pageSize=25&includes=contacts&filterByDate=ModifiedDate&startDate=2025-03-01&endDate=2025-03-30*
   *
   *
   * Example: return the unassigned jobs (including contacts) that were marked as Dead
   *
   * *\/jobs?assignment=unassigned&milestones=Dead&pageSize=25&includes=contacts&filterByDate=ModifiedDate&startDate=2025-03-01&endDate=2025-03-30*
   *
   * @summary Jobs List.
   * @throws FetchError<400, types.GetJobsResponse400> Bad Request
   * @throws FetchError<401, types.GetJobsResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetJobsResponse416> The range of data requested from the resource is invalid
   */
  getJobs(metadata?: types.GetJobsMetadataParam): Promise<FetchResponse<200, types.GetJobsResponse200>> {
    return this.core.fetch('/jobs', 'get', metadata);
  }

  /**
   * Use this endpoint to create a job in the milestone Lead (Unassigned).
   *
   * @summary Create job
   * @throws FetchError<400, types.PostjobResponse400> Bad Request
   * @throws FetchError<401, types.PostjobResponse401> API Key is invalid or deactivated
   * @throws FetchError<403, types.PostjobResponse403> Not enough permissions.
   * @throws FetchError<404, types.PostjobResponse404> Requested resource does not exist.
   */
  postjob(body: types.PostjobBodyParam): Promise<FetchResponse<201, types.PostjobResponse201>> {
    return this.core.fetch('/jobs', 'post', body);
  }

  /**
   * Use this endpoint to get a external reference based on the following query parameters:
   * - `jobId`
   * - `projectId` * case insensitive
   * - `source` * mandatory & case insensitive
   * - `jobId` and `projectId` are optional, but at least one of them are needed in the
   * request.
   *
   * @summary Get an external reference
   * @throws FetchError<400, types.GetJobExternalReferencesResponse400> Bad Request
   * @throws FetchError<401, types.GetJobExternalReferencesResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetJobExternalReferencesResponse404> Requested resource does not exist.
   */
  getJobExternalReferences(metadata: types.GetJobExternalReferencesMetadataParam): Promise<FetchResponse<200, types.GetJobExternalReferencesResponse200>> {
    return this.core.fetch('/jobs/external-references', 'get', metadata);
  }

  /**
   * Use this endpoint to create a new external reference for a job to an external source and
   * project
   *
   * @summary Set an external reference for a job
   * @throws FetchError<400, types.PostCreateJobExternalReferenceResponse400> Bad Request
   * @throws FetchError<401, types.PostCreateJobExternalReferenceResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostCreateJobExternalReferenceResponse404> Requested resource does not exist.
   */
  postCreateJobExternalReference(body: types.PostCreateJobExternalReferenceBodyParam): Promise<FetchResponse<201, types.PostCreateJobExternalReferenceResponse201>> {
    return this.core.fetch('/jobs/external-references', 'post', body);
  }

  /**
   * Use this endpoint to get a listing of jobs matching the given search criteria.  Jobs are
   * returned if they include a given search term and/or they are near a given set of map
   * coordinates.  At least one of searchTerm or geoLocation must be included.  If both are
   * included, jobs returned must match both criteria.   <br/><br/>The size of the return is
   * controlled with the pageSize query parameter which defaults to 10 and must be > 0 and <=
   * 25.  Set StartIndex >= 0 to access jobs past the first page when more than pageSize jobs
   * meet the search criteria. The StartIndex parameter to start looking for records should
   * not exceed 100000
   * <br/><br/>Unassigned leads or jobs will not be returned. <br/><br/>Supported includes
   * values: contact, initalAppointment. <br/><br/>Example: return up to 25 jobs (including
   * initial appointment) that contain "Maple Lane" and are within 1 kilometer of the map
   * location (40.689247,-74.044502).
   * <br/><br/><b>/jobs/search?pageSize=25&includes=initialAppointment<br> {<br>
   *   "searchTerm": "Maple Lane",<br>
   *   "geoLocation": {<br>
   *     "latitude": 40.689247,<br>
   *     "longitude": -74.044502,<br>
   *     "mapRadius" 1<br>
   *     }<br>
   *   }
   *
   * @summary Jobs Search.
   * @throws FetchError<400, types.JobsSearchResponse400> Bad Request
   * @throws FetchError<401, types.JobsSearchResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.JobsSearchResponse416> The range of data requested from the resource is invalid
   */
  jobsSearch(body?: types.JobsSearchBodyParam, metadata?: types.JobsSearchMetadataParam): Promise<FetchResponse<200, types.JobsSearchResponse200>> {
    return this.core.fetch('/jobs/search', 'post', body, metadata);
  }

  /**
   * Use this endpoint to get details for a specific job. <br/><br/>Unassigned leads or jobs
   * will not be returned. <br/><br/>Supported includes values: contact, initalAppointment.
   *
   * @summary Get Job by Id.
   */
  getJob(metadata: types.GetJobMetadataParam): Promise<FetchResponse<200, types.GetJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}', 'get', metadata);
  }

  /**
   * This endpoint returns the job's insurance adjuster information.
   *
   * @summary Get Job Adjuster Information.
   * @throws FetchError<400, types.GetAdjusterForJobResponse400> Bad Request
   * @throws FetchError<401, types.GetAdjusterForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetAdjusterForJobResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.GetAdjusterForJobResponse412> The request could not be completed due to the failure of a required precondition.
   */
  getAdjusterForJob(metadata: types.GetAdjusterForJobMetadataParam): Promise<FetchResponse<200, types.GetAdjusterForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/adjuster', 'get', metadata);
  }

  /**
   * Use this endpoint to get the list of contacts for a job. <br/>Supported includes value:
   * contact.
   *
   * @summary Contact List
   * @throws FetchError<400, types.GetJobContactsResponse400> Bad Request
   * @throws FetchError<401, types.GetJobContactsResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetJobContactsResponse404> Requested resource does not exist.
   */
  getJobContacts(metadata: types.GetJobContactsMetadataParam): Promise<FetchResponse<200, types.GetJobContactsResponse200>> {
    return this.core.fetch('/jobs/{jobId}/contacts', 'get', metadata);
  }

  /**
   * Use this endpoint to get details of a specific job contact. <br/>Supported includes
   * value: contact.
   *
   * @summary Get a job contact by Id
   * @throws FetchError<400, types.GetJobContactResponse400> Bad Request
   * @throws FetchError<401, types.GetJobContactResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetJobContactResponse404> Requested resource does not exist.
   */
  getJobContact(metadata: types.GetJobContactMetadataParam): Promise<FetchResponse<200, types.GetJobContactResponse200>> {
    return this.core.fetch('/jobs/{jobId}/contacts/{jobContactId}', 'get', metadata);
  }

  /**
   * Get a list of all custom fields related to a specific job by its job Id.
   * This endpoint will return a paginated response starting from the given record index.
   * StartIndex starts at 0. Default PageSize is 25. Pagination parameters are optional.
   *
   * @summary Retrieve all the custom fields for a job by id
   * @throws FetchError<400, types.GetJobCustomFieldsResponse400> Bad Request
   * @throws FetchError<401, types.GetJobCustomFieldsResponse401> API Key is invalid or deactivated
   * @throws FetchError<403, types.GetJobCustomFieldsResponse403> Not enough permissions.
   * @throws FetchError<404, types.GetJobCustomFieldsResponse404> Requested resource does not exist.
   */
  getJobCustomFields(metadata: types.GetJobCustomFieldsMetadataParam): Promise<FetchResponse<200, types.GetJobCustomFieldsResponse200>> {
    return this.core.fetch('/jobs/{jobId}/custom-fields', 'get', metadata);
  }

  /**
   * Use this endpoint to update multiple custom field values for a Job.
   * The limit of the Custom Field list to update cannot be greater than 120.
   * If the custom field type is Text, the maximum lenght of the text is 500 characters. 
   * Any text beyond that limit that will be truncated.
   *
   * @summary Sets multiple custom field values for a job by id
   * @throws FetchError<400, types.PutJobCustomFieldsResponse400> Bad Request
   * @throws FetchError<401, types.PutJobCustomFieldsResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PutJobCustomFieldsResponse404> Requested resource does not exist.
   * @throws FetchError<416, types.PutJobCustomFieldsResponse416> The range of data requested from the resource is invalid
   */
  putJobCustomFields(body: types.PutJobCustomFieldsBodyParam, metadata: types.PutJobCustomFieldsMetadataParam): Promise<FetchResponse<number, unknown>>;
  putJobCustomFields(metadata: types.PutJobCustomFieldsMetadataParam): Promise<FetchResponse<number, unknown>>;
  putJobCustomFields(body?: types.PutJobCustomFieldsBodyParam | types.PutJobCustomFieldsMetadataParam, metadata?: types.PutJobCustomFieldsMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/jobs/{jobId}/custom-fields', 'put', body, metadata);
  }

  /**
   * Get a custom field object inside a job provided a custom field id and a valid Job id
   *
   * @summary Retrieve a specific custom field for a job by id
   * @throws FetchError<400, types.GetJobCustomFieldByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetJobCustomFieldByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<403, types.GetJobCustomFieldByIdResponse403> Not enough permissions.
   * @throws FetchError<404, types.GetJobCustomFieldByIdResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.GetJobCustomFieldByIdResponse412> The request could not be completed due to the failure of a required precondition.
   */
  getJobCustomFieldById(metadata: types.GetJobCustomFieldByIdMetadataParam): Promise<FetchResponse<200, types.GetJobCustomFieldByIdResponse200>> {
    return this.core.fetch('/jobs/{jobId}/custom-fields/{customFieldId}', 'get', metadata);
  }

  /**
   * Sets a value for the specified custom field in the Job.
   * If the custom field type is Text, the maximum lenght of the text is 500 characters. 
   * Any text beyond that limit will be truncated.
   *
   * @summary Sets a value for a specific custom field for a job by id
   * @throws FetchError<400, types.PutJobCustomFieldByIdResponse400> Bad Request
   * @throws FetchError<401, types.PutJobCustomFieldByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PutJobCustomFieldByIdResponse404> Requested resource does not exist.
   */
  putJobCustomFieldById(body: types.PutJobCustomFieldByIdBodyParam, metadata: types.PutJobCustomFieldByIdMetadataParam): Promise<FetchResponse<number, unknown>>;
  putJobCustomFieldById(metadata: types.PutJobCustomFieldByIdMetadataParam): Promise<FetchResponse<number, unknown>>;
  putJobCustomFieldById(body?: types.PutJobCustomFieldByIdBodyParam | types.PutJobCustomFieldByIdMetadataParam, metadata?: types.PutJobCustomFieldByIdMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/jobs/{jobId}/custom-fields/{customFieldId}', 'put', body, metadata);
  }

  /**
   * Use this endpoint to add a job document for a specific job.  Special characters and
   * spaces will be removed from the file name before upload.
   *
   * @summary Add JobDocument
   * @throws FetchError<400, types.PostAddJobDocumentResponse400> Bad Request
   * @throws FetchError<401, types.PostAddJobDocumentResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostAddJobDocumentResponse404> Requested resource does not exist.
   */
  postAddJobDocument(body: types.PostAddJobDocumentBodyParam, metadata: types.PostAddJobDocumentMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/jobs/{jobId}/documents', 'post', body, metadata);
  }

  /**
   * 'Use this endpoint to get a list of estimates for the specified job.'. This endpoint
   * will return a paginated response starting from the given record index.
   *
   * @summary Get estimates for a job
   * @throws FetchError<400, types.GetEstimatesForJobResponse400> Bad Request
   * @throws FetchError<401, types.GetEstimatesForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetEstimatesForJobResponse404> Requested resource does not exist.
   * @throws FetchError<416, types.GetEstimatesForJobResponse416> The range of data requested from the resource is invalid
   */
  getEstimatesForJob(metadata: types.GetEstimatesForJobMetadataParam): Promise<FetchResponse<200, types.GetEstimatesForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/estimates', 'get', metadata);
  }

  /**
   * 'Use this endpoint to get a list of invoices for the specified job.'
   *
   * @summary Get invoices for a job
   * @throws FetchError<400, types.GetInvoicesForJobResponse400> Bad Request
   * @throws FetchError<401, types.GetInvoicesForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetInvoicesForJobResponse404> Requested resource does not exist.
   * @throws FetchError<416, types.GetInvoicesForJobResponse416> The range of data requested from the resource is invalid
   */
  getInvoicesForJob(metadata: types.GetInvoicesForJobMetadataParam): Promise<FetchResponse<200, types.GetInvoicesForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/invoices', 'get', metadata);
  }

  /**
   * Use this endpoint to get the Financials for the specified job.  <br/>Supported includes
   * value: worksheet, amendments.
   *
   * @summary Get Financials for a job
   * @throws FetchError<400, types.GetFinancialsForJobResponse400> Bad Request
   * @throws FetchError<401, types.GetFinancialsForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetFinancialsForJobResponse404> Requested resource does not exist.
   */
  getFinancialsForJob(metadata: types.GetFinancialsForJobMetadataParam): Promise<FetchResponse<200, types.GetFinancialsForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/financials', 'get', metadata);
  }

  /**
   * Use this endpoint to get status of the accounting integration sync for the specified
   * job.
   *
   * @summary Get accounting integration status for a job
   * @throws FetchError<400, types.GetAccountingIntegrationsSyncChangesForJobResponse400> Bad Request
   * @throws FetchError<401, types.GetAccountingIntegrationsSyncChangesForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<403, types.GetAccountingIntegrationsSyncChangesForJobResponse403> Not enough permissions.
   * @throws FetchError<404, types.GetAccountingIntegrationsSyncChangesForJobResponse404> Requested resource does not exist.
   */
  getAccountingIntegrationsSyncChangesForJob(metadata: types.GetAccountingIntegrationsSyncChangesForJobMetadataParam): Promise<FetchResponse<200, types.GetAccountingIntegrationsSyncChangesForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/accounting/integration-status', 'get', metadata);
  }

  /**
   * Use this endpoint to get a history of actions performed for a job.   <br/>Supported
   * includes values: createdBy. <br/>When startDate and endDate are specified, actions
   * returned will be filtered to those created between those dates (inclusive). This
   * endpoint will return a paginated response starting from the given record index.
   *
   * @summary Job change history
   * @throws FetchError<400, types.GetJobHistoryResponse400> Bad Request
   * @throws FetchError<401, types.GetJobHistoryResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetJobHistoryResponse404> Requested resource does not exist.
   * @throws FetchError<416, types.GetJobHistoryResponse416> The range of data requested from the resource is invalid
   */
  getJobHistory(metadata: types.GetJobHistoryMetadataParam): Promise<FetchResponse<200, types.GetJobHistoryResponse200>> {
    return this.core.fetch('/jobs/{jobId}/history', 'get', metadata);
  }

  /**
   * Use this endpoint to get the initial appointment for a job.
   *
   * @summary Job Initial Appointment.
   * @throws FetchError<401, types.GetInitialAppointmentForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetInitialAppointmentForJobResponse404> Requested resource does not exist.
   */
  getInitialAppointmentForJob(metadata: types.GetInitialAppointmentForJobMetadataParam): Promise<FetchResponse<200, types.GetInitialAppointmentForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/initial-appointment', 'get', metadata);
  }

  /**
   * Use this endpoint to add or modify the initial appointment for a job. All datetimes
   * should be UTC and in ISO 8601 format (suffixed with 'Z').
   *
   * @summary Add or Update Initial Appointment
   * @throws FetchError<400, types.PutInitialAppointmentForJobResponse400> Bad Request
   * @throws FetchError<401, types.PutInitialAppointmentForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PutInitialAppointmentForJobResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.PutInitialAppointmentForJobResponse412> The request could not be completed due to the failure of a required precondition.
   */
  putInitialAppointmentForJob(body: types.PutInitialAppointmentForJobBodyParam, metadata: types.PutInitialAppointmentForJobMetadataParam): Promise<FetchResponse<number, unknown>>;
  putInitialAppointmentForJob(metadata: types.PutInitialAppointmentForJobMetadataParam): Promise<FetchResponse<number, unknown>>;
  putInitialAppointmentForJob(body?: types.PutInitialAppointmentForJobBodyParam | types.PutInitialAppointmentForJobMetadataParam, metadata?: types.PutInitialAppointmentForJobMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/jobs/{jobId}/initial-appointment', 'put', body, metadata);
  }

  /**
   * This endpoint returns the job's insurance information.
   *
   * @summary Get Job Insurance Information.
   * @throws FetchError<400, types.GetInsuranceForJobResponse400> Bad Request
   * @throws FetchError<401, types.GetInsuranceForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetInsuranceForJobResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.GetInsuranceForJobResponse412> The request could not be completed due to the failure of a required precondition.
   */
  getInsuranceForJob(metadata: types.GetInsuranceForJobMetadataParam): Promise<FetchResponse<200, types.GetInsuranceForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/insurance', 'get', metadata);
  }

  /**
   * This endpoint sets an insurance company to an existing job. It can be set by ID or by
   * name, but not both.  The ID should belong to the existing insurance companies. If the
   * name is used it will be assigned to "Other" (active) insurance company. Set them as not
   * assigned can be done, just sending both(ID & name) null or empty will do it.
   *
   * @summary Set Insurance Company for an existing Job.
   * @throws FetchError<400, types.PutInsuranceCompanyForJobResponse400> Bad Request
   * @throws FetchError<401, types.PutInsuranceCompanyForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PutInsuranceCompanyForJobResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.PutInsuranceCompanyForJobResponse412> The request could not be completed due to the failure of a required precondition.
   */
  putInsuranceCompanyForJob(body: types.PutInsuranceCompanyForJobBodyParam, metadata: types.PutInsuranceCompanyForJobMetadataParam): Promise<FetchResponse<number, unknown>>;
  putInsuranceCompanyForJob(metadata: types.PutInsuranceCompanyForJobMetadataParam): Promise<FetchResponse<number, unknown>>;
  putInsuranceCompanyForJob(body?: types.PutInsuranceCompanyForJobBodyParam | types.PutInsuranceCompanyForJobMetadataParam, metadata?: types.PutInsuranceCompanyForJobMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/jobs/{jobId}/insurance/insurance-company', 'put', body, metadata);
  }

  /**
   * Use this endpoint to create a job message. Please note that the message will only be
   * created as a comment.
   *
   * @summary Create Job Message
   * @throws FetchError<400, types.PostCreateJobMessageResponse400> Bad Request
   * @throws FetchError<401, types.PostCreateJobMessageResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostCreateJobMessageResponse404> Requested resource does not exist.
   */
  postCreateJobMessage(body: types.PostCreateJobMessageBodyParam, metadata: types.PostCreateJobMessageMetadataParam): Promise<FetchResponse<201, types.PostCreateJobMessageResponse201>> {
    return this.core.fetch('/jobs/{jobId}/messages', 'post', body, metadata);
  }

  /**
   * Use this endpoint to reply to an existing job message. Please note that the message will
   * only be created as a comment.
   *
   * @summary Reply Job Message
   * @throws FetchError<400, types.PostReplyJobMessageResponse400> Bad Request
   * @throws FetchError<401, types.PostReplyJobMessageResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostReplyJobMessageResponse404> Requested resource does not exist.
   */
  postReplyJobMessage(body: types.PostReplyJobMessageBodyParam, metadata: types.PostReplyJobMessageMetadataParam): Promise<FetchResponse<201, types.PostReplyJobMessageResponse201>> {
    return this.core.fetch('/jobs/{jobId}/messages/{messageId}/replies', 'post', body, metadata);
  }

  /**
   * Get milestone history for the specified Job.
   *
   * @summary Get milestone history for the specified Job.
   */
  getMilestonesForJob(metadata: types.GetMilestonesForJobMetadataParam): Promise<FetchResponse<200, types.GetMilestonesForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/milestone-history', 'get', metadata);
  }

  /**
   * Get a single milestone information by id. For including statuses the company must have
   * enabled custom workflows.
   * Valid include values are: status.
   *
   * @summary Get a single milestone for a job by milestone id.
   * @throws FetchError<400, types.GetJobMilestoneByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetJobMilestoneByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<403, types.GetJobMilestoneByIdResponse403> Not enough permissions.
   * @throws FetchError<404, types.GetJobMilestoneByIdResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.GetJobMilestoneByIdResponse412> The request could not be completed due to the failure of a required precondition.
   */
  getJobMilestoneById(metadata: types.GetJobMilestoneByIdMetadataParam): Promise<FetchResponse<200, types.GetJobMilestoneByIdResponse200>> {
    return this.core.fetch('/jobs/{jobId}/milestones/{milestoneId}', 'get', metadata);
  }

  /**
   * Get a single status information by id.
   *
   * @summary Get a single status for a milestone by status id.
   * @throws FetchError<400, types.GetJobStatusByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetJobStatusByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<403, types.GetJobStatusByIdResponse403> Not enough permissions.
   * @throws FetchError<404, types.GetJobStatusByIdResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.GetJobStatusByIdResponse412> The request could not be completed due to the failure of a required precondition.
   */
  getJobStatusById(metadata: types.GetJobStatusByIdMetadataParam): Promise<FetchResponse<200, types.GetJobStatusByIdResponse200>> {
    return this.core.fetch('/jobs/{jobId}/milestones/{milestoneId}/status/{statusId}', 'get', metadata);
  }

  /**
   * Get the current milestone information. For including statuses the company must have
   * enabled custom workflows. 
   * Valid include value is: status.
   *
   * @summary Get the current milestone for a job.
   * @throws FetchError<400, types.GetCurrentJobMilestoneResponse400> Bad Request
   * @throws FetchError<401, types.GetCurrentJobMilestoneResponse401> API Key is invalid or deactivated
   * @throws FetchError<403, types.GetCurrentJobMilestoneResponse403> Not enough permissions.
   * @throws FetchError<404, types.GetCurrentJobMilestoneResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.GetCurrentJobMilestoneResponse412> The request could not be completed due to the failure of a required precondition.
   */
  getCurrentJobMilestone(metadata: types.GetCurrentJobMilestoneMetadataParam): Promise<FetchResponse<200, types.GetCurrentJobMilestoneResponse200>> {
    return this.core.fetch('/jobs/{jobId}/milestones/current', 'get', metadata);
  }

  /**
   * Use this endpoint to get payments information for the specified job.
   *
   * @summary Get Job Payments
   * @throws FetchError<400, types.GetPaymentsResponse400> Bad Request
   * @throws FetchError<401, types.GetPaymentsResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetPaymentsResponse404> Requested resource does not exist.
   */
  getPayments(metadata: types.GetPaymentsMetadataParam): Promise<FetchResponse<200, types.GetPaymentsResponse200>> {
    return this.core.fetch('/jobs/{jobId}/payments', 'get', metadata);
  }

  /**
   * Use this endpoint to get a high-level overview of financial information for the
   * specified job.
   *
   * @summary Get Job Payments Overview
   * @throws FetchError<400, types.GetPaymentsOverviewForJobResponse400> Bad Request
   * @throws FetchError<401, types.GetPaymentsOverviewForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetPaymentsOverviewForJobResponse404> Requested resource does not exist.
   */
  getPaymentsOverviewForJob(metadata: types.GetPaymentsOverviewForJobMetadataParam): Promise<FetchResponse<200, types.GetPaymentsOverviewForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/payments/overview', 'get', metadata);
  }

  /**
   * Use this endpoint to create a new payment received
   *
   * @summary Create Payment Received
   * @throws FetchError<400, types.PostCreatePaymentReceivedResponse400> Bad Request
   * @throws FetchError<401, types.PostCreatePaymentReceivedResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostCreatePaymentReceivedResponse404> Requested resource does not exist.
   */
  postCreatePaymentReceived(body: types.PostCreatePaymentReceivedBodyParam, metadata: types.PostCreatePaymentReceivedMetadataParam): Promise<FetchResponse<201, types.PostCreatePaymentReceivedResponse201>>;
  postCreatePaymentReceived(metadata: types.PostCreatePaymentReceivedMetadataParam): Promise<FetchResponse<201, types.PostCreatePaymentReceivedResponse201>>;
  postCreatePaymentReceived(body?: types.PostCreatePaymentReceivedBodyParam | types.PostCreatePaymentReceivedMetadataParam, metadata?: types.PostCreatePaymentReceivedMetadataParam): Promise<FetchResponse<201, types.PostCreatePaymentReceivedResponse201>> {
    return this.core.fetch('/jobs/{jobId}/payments/received', 'post', body, metadata);
  }

  /**
   * Use this endpoint to create a new payment paid
   *
   * @summary Create Payment Paid
   * @throws FetchError<400, types.PostCreatePaymentPaidResponse400> Bad Request
   * @throws FetchError<401, types.PostCreatePaymentPaidResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostCreatePaymentPaidResponse404> Requested resource does not exist.
   */
  postCreatePaymentPaid(body: types.PostCreatePaymentPaidBodyParam, metadata: types.PostCreatePaymentPaidMetadataParam): Promise<FetchResponse<201, types.PostCreatePaymentPaidResponse201>>;
  postCreatePaymentPaid(metadata: types.PostCreatePaymentPaidMetadataParam): Promise<FetchResponse<201, types.PostCreatePaymentPaidResponse201>>;
  postCreatePaymentPaid(body?: types.PostCreatePaymentPaidBodyParam | types.PostCreatePaymentPaidMetadataParam, metadata?: types.PostCreatePaymentPaidMetadataParam): Promise<FetchResponse<201, types.PostCreatePaymentPaidResponse201>> {
    return this.core.fetch('/jobs/{jobId}/payments/paid', 'post', body, metadata);
  }

  /**
   * Use this endpoint to create a new payment Additional Job Expenses
   *
   * @summary Create Payment Additional Job Expenses
   * @throws FetchError<400, types.PostCreatePaymentAdditionalExpenseResponse400> Bad Request
   * @throws FetchError<401, types.PostCreatePaymentAdditionalExpenseResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostCreatePaymentAdditionalExpenseResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.PostCreatePaymentAdditionalExpenseResponse412> The request could not be completed due to the failure of a required precondition.
   */
  postCreatePaymentAdditionalExpense(body: types.PostCreatePaymentAdditionalExpenseBodyParam, metadata: types.PostCreatePaymentAdditionalExpenseMetadataParam): Promise<FetchResponse<201, types.PostCreatePaymentAdditionalExpenseResponse201>>;
  postCreatePaymentAdditionalExpense(metadata: types.PostCreatePaymentAdditionalExpenseMetadataParam): Promise<FetchResponse<201, types.PostCreatePaymentAdditionalExpenseResponse201>>;
  postCreatePaymentAdditionalExpense(body?: types.PostCreatePaymentAdditionalExpenseBodyParam | types.PostCreatePaymentAdditionalExpenseMetadataParam, metadata?: types.PostCreatePaymentAdditionalExpenseMetadataParam): Promise<FetchResponse<201, types.PostCreatePaymentAdditionalExpenseResponse201>> {
    return this.core.fetch('/jobs/{jobId}/payments/expense', 'post', body, metadata);
  }

  /**
   * Use this endpoint to get the list of representatives for a Job. This endpoint will
   * return a paginated response starting from the given record index.
   *
   * @summary Job Representatives List
   * @throws FetchError<400, types.GetRepresentativesForJobResponse400> Bad Request
   * @throws FetchError<401, types.GetRepresentativesForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetRepresentativesForJobResponse404> Requested resource does not exist.
   * @throws FetchError<416, types.GetRepresentativesForJobResponse416> The range of data requested from the resource is invalid
   */
  getRepresentativesForJob(metadata: types.GetRepresentativesForJobMetadataParam): Promise<FetchResponse<200, types.GetRepresentativesForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/representatives', 'get', metadata);
  }

  /**
   * Use this endpoint to get the company representative for a job.
   *
   * @summary Get Company Representative
   * @throws FetchError<401, types.GetCompanyRepresentativeForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetCompanyRepresentativeForJobResponse404> Requested resource does not exist.
   */
  getCompanyRepresentativeForJob(metadata: types.GetCompanyRepresentativeForJobMetadataParam): Promise<FetchResponse<200, types.GetCompanyRepresentativeForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/representatives/company', 'get', metadata);
  }

  /**
   * Use this endpoint to update the company representative for a job.
   *
   * @summary Update Company Representative
   * @throws FetchError<401, types.PostCompanyRepresentativeForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostCompanyRepresentativeForJobResponse404> Requested resource does not exist.
   */
  postCompanyRepresentativeForJob(body: types.PostCompanyRepresentativeForJobBodyParam, metadata: types.PostCompanyRepresentativeForJobMetadataParam): Promise<FetchResponse<number, unknown>>;
  postCompanyRepresentativeForJob(metadata: types.PostCompanyRepresentativeForJobMetadataParam): Promise<FetchResponse<number, unknown>>;
  postCompanyRepresentativeForJob(body?: types.PostCompanyRepresentativeForJobBodyParam | types.PostCompanyRepresentativeForJobMetadataParam, metadata?: types.PostCompanyRepresentativeForJobMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/jobs/{jobId}/representatives/company', 'post', body, metadata);
  }

  /**
   * Use this endpoint to get the sales owner for a job.
   *
   * @summary Get Sales Owner
   * @throws FetchError<401, types.GetSalesOwnerForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetSalesOwnerForJobResponse404> Requested resource does not exist.
   */
  getSalesOwnerForJob(metadata: types.GetSalesOwnerForJobMetadataParam): Promise<FetchResponse<200, types.GetSalesOwnerForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/representatives/sales-owner', 'get', metadata);
  }

  /**
   * Use this endpoint to add or update the sales owner for a job.
   *
   * @summary Add or Update Sales Owner
   * @throws FetchError<401, types.PostSalesOwnerForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostSalesOwnerForJobResponse404> Requested resource does not exist.
   */
  postSalesOwnerForJob(body: types.PostSalesOwnerForJobBodyParam, metadata: types.PostSalesOwnerForJobMetadataParam): Promise<FetchResponse<number, unknown>>;
  postSalesOwnerForJob(metadata: types.PostSalesOwnerForJobMetadataParam): Promise<FetchResponse<number, unknown>>;
  postSalesOwnerForJob(body?: types.PostSalesOwnerForJobBodyParam | types.PostSalesOwnerForJobMetadataParam, metadata?: types.PostSalesOwnerForJobMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/jobs/{jobId}/representatives/sales-owner', 'post', body, metadata);
  }

  /**
   * Use this endpoint to remove the sales owner from a job.
   *
   * @summary Delete Sales Owner
   * @throws FetchError<401, types.DeleteSalesOwnerFromJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.DeleteSalesOwnerFromJobResponse404> Requested resource does not exist.
   */
  deleteSalesOwnerFromJob(metadata: types.DeleteSalesOwnerFromJobMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/jobs/{jobId}/representatives/sales-owner', 'delete', metadata);
  }

  /**
   * Use this endpoint to get the A/R representative for a job.
   *
   * @summary Get A/R Owner
   * @throws FetchError<401, types.GetArOwnerForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetArOwnerForJobResponse404> Requested resource does not exist.
   */
  getAROwnerForJob(metadata: types.GetArOwnerForJobMetadataParam): Promise<FetchResponse<200, types.GetArOwnerForJobResponse200>> {
    return this.core.fetch('/jobs/{jobId}/representatives/ar-owner', 'get', metadata);
  }

  /**
   * Use this endpoint to add or update the A/R Owner for a job.
   *
   * @summary Add or Update A/R Owner
   * @throws FetchError<401, types.PostArOwnerForJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostArOwnerForJobResponse404> Requested resource does not exist.
   */
  postAROwnerForJob(body: types.PostArOwnerForJobBodyParam, metadata: types.PostArOwnerForJobMetadataParam): Promise<FetchResponse<number, unknown>>;
  postAROwnerForJob(metadata: types.PostArOwnerForJobMetadataParam): Promise<FetchResponse<number, unknown>>;
  postAROwnerForJob(body?: types.PostArOwnerForJobBodyParam | types.PostArOwnerForJobMetadataParam, metadata?: types.PostArOwnerForJobMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/jobs/{jobId}/representatives/ar-owner', 'post', body, metadata);
  }

  /**
   * Use this endpoint to remove the A/R owner from a job.
   *
   * @summary Delete A/R Owner
   * @throws FetchError<401, types.DeleteArOwnerFromJobResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.DeleteArOwnerFromJobResponse404> Requested resource does not exist.
   */
  deleteAROwnerFromJob(metadata: types.DeleteArOwnerFromJobMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/jobs/{jobId}/representatives/ar-owner', 'delete', metadata);
  }

  /**
   * Use this endpoint to Upload a single Photo or Video for the specified job.  Special
   * characters and spaces will be removed from the file name before upload.
   *
   * @summary Upload a photo or video to a Job
   * @throws FetchError<400, types.PostUploadPhotoOrVideoResponse400> Bad Request
   * @throws FetchError<401, types.PostUploadPhotoOrVideoResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostUploadPhotoOrVideoResponse404> Requested resource does not exist.
   */
  postUploadPhotoOrVideo(body: types.PostUploadPhotoOrVideoBodyParam, metadata: types.PostUploadPhotoOrVideoMetadataParam): Promise<FetchResponse<number, unknown>>;
  postUploadPhotoOrVideo(metadata: types.PostUploadPhotoOrVideoMetadataParam): Promise<FetchResponse<number, unknown>>;
  postUploadPhotoOrVideo(body?: types.PostUploadPhotoOrVideoBodyParam | types.PostUploadPhotoOrVideoMetadataParam, metadata?: types.PostUploadPhotoOrVideoMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/jobs/{jobId}/photos-videos', 'post', body, metadata);
  }

  /**
   * - Use this endpoint to create one or more manual measurements using a list of
   * measurements entered in a file
   * - The measurements file must contain the measurements information for the measurements
   * to be created on the job. The file extension should be .json, and the content must be a
   * valid JSON structure.
   * - The JSON information will be created as new manual measurements; the data within the
   * JSON file will not be validated.
   *
   * @summary Create manual measurements for a job.
   * @throws FetchError<400, types.PostJobMeasurementsUploadResponse400> Bad Request
   * @throws FetchError<401, types.PostJobMeasurementsUploadResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostJobMeasurementsUploadResponse404> Requested resource does not exist.
   */
  postJobMeasurementsUpload(body: types.PostJobMeasurementsUploadBodyParam, metadata: types.PostJobMeasurementsUploadMetadataParam): Promise<FetchResponse<202, types.PostJobMeasurementsUploadResponse202>> {
    return this.core.fetch('/jobs/{jobId}/measurements', 'post', body, metadata);
  }

  /**
   * Use this endpoint to create a measurements order with the external provider Information
   * for a specific job.
   * - The measurement file can be an XML or JSON file.
   *   - The file content has to be a valid XML or JSON structure.
   *   - The file must contain the measurements order information with the measurements to be
   * created.
   * - A report PDF can be attached.
   * - A list of PDF files can be attached.
   * - Special characters and spaces will be removed from all the file names before upload.
   * - The PDF files content will not be validated, only the type as PDF and the file size.
   *
   * @summary Create a new measurements order for a job.
   * @throws FetchError<400, types.PostJobMeasurementsUploadFilesResponse400> Bad Request
   * @throws FetchError<401, types.PostJobMeasurementsUploadFilesResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostJobMeasurementsUploadFilesResponse404> Requested resource does not exist.
   * @throws FetchError<412, types.PostJobMeasurementsUploadFilesResponse412> The request could not be completed due to the failure of a required precondition.
   * @throws FetchError<416, types.PostJobMeasurementsUploadFilesResponse416> The range of data requested from the resource is invalid
   */
  postJobMeasurementsUploadFiles(body: types.PostJobMeasurementsUploadFilesBodyParam, metadata: types.PostJobMeasurementsUploadFilesMetadataParam): Promise<FetchResponse<202, types.PostJobMeasurementsUploadFilesResponse202>> {
    return this.core.fetch('/jobs/{jobId}/measurements/files', 'post', body, metadata);
  }

  /**
   * Use this endpoint to get a history of actions performed for a lead.   <br/>Supported
   * includes values: createdBy.
   *
   * @summary Get the history of the specified Lead.
   * @throws FetchError<401, types.GetLeadHistoryResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetLeadHistoryResponse404> Requested resource does not exist.
   */
  getLeadHistory(metadata: types.GetLeadHistoryMetadataParam): Promise<FetchResponse<200, types.GetLeadHistoryResponse200>> {
    return this.core.fetch('/leads/{leadId}/history', 'get', metadata);
  }

  /**
   * Use this endpoint to get the list of users for a company. <br /> The status filter can
   * be used to filter users based on status - active, inactive, archived, or deleted.  By
   * default, only active users will be returned. This endpoint will return a paginated
   * response starting from the given record index.
   *
   * @summary Get Users
   * @throws FetchError<400, types.GetUsersResponse400> Bad Request
   * @throws FetchError<401, types.GetUsersResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetUsersResponse416> The range of data requested from the resource is invalid
   */
  getUsers(metadata?: types.GetUsersMetadataParam): Promise<FetchResponse<200, types.GetUsersResponse200>> {
    return this.core.fetch('/users', 'get', metadata);
  }

  /**
   * Use this endpoint to get the details of a specific user.
   *
   * @summary Get User
   * @throws FetchError<400, types.GetUserResponse400> Bad Request
   * @throws FetchError<401, types.GetUserResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetUserResponse404> Requested resource does not exist.
   */
  getUser(metadata: types.GetUserMetadataParam): Promise<FetchResponse<200, types.GetUserResponse200>> {
    return this.core.fetch('/users/{userId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of instances for a scheduled report by it's unique
   * identifier.   If the scheduled report requested is not available the response will be a
   * Not Found error.  If the scheduled report requested hasn'run yet the response will be an
   * Empty response.
   *
   * @summary Get a list of instance runs for a Report Schedule Id
   * @throws FetchError<400, types.GetReportsByInstanceInstanceRunsByScheduleIdResponse400> Bad Request
   * @throws FetchError<401, types.GetReportsByInstanceInstanceRunsByScheduleIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetReportsByInstanceInstanceRunsByScheduleIdResponse404> Requested resource does not exist.
   * @throws FetchError<416, types.GetReportsByInstanceInstanceRunsByScheduleIdResponse416> The range of data requested from the resource is invalid
   */
  getReportsByInstanceInstanceRunsByScheduleId(metadata: types.GetReportsByInstanceInstanceRunsByScheduleIdMetadataParam): Promise<FetchResponse<200, types.GetReportsByInstanceInstanceRunsByScheduleIdResponse200>> {
    return this.core.fetch('/reports/scheduled-reports/{scheduledReportId}/runs', 'get', metadata);
  }

  /**
   * Use this endpoint to get a scheduled report instance by it's instance run unique
   * identifier.   If the scheduled report requested is not available the response will be a
   * not found error.  If the instance of the scheduled report doesn't exists, the response
   * will be a Not Found error
   *
   * @summary Report by instance Id
   * @throws FetchError<400, types.GetReportByInstanceIdResponse400> Bad Request
   * @throws FetchError<401, types.GetReportByInstanceIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetReportByInstanceIdResponse404> Requested resource does not exist.
   */
  getReportByInstanceId(metadata: types.GetReportByInstanceIdMetadataParam): Promise<FetchResponse<200, types.GetReportByInstanceIdResponse200>> {
    return this.core.fetch('/reports/scheduled-reports/{scheduledReportId}/runs/{instanceRunId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get a scheduled report latest instance. If the scheduled report
   * requested is not available the response will be a Not Found error. If the scheduled
   * report requested hasn't run yet, the response will be an Empty response.
   *
   * @summary Report get latest instance
   * @throws FetchError<400, types.GetReportLatestInstanceResponse400> Bad Request
   * @throws FetchError<401, types.GetReportLatestInstanceResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetReportLatestInstanceResponse404> Requested resource does not exist.
   */
  getReportLatestInstance(metadata: types.GetReportLatestInstanceMetadataParam): Promise<FetchResponse<200, types.GetReportLatestInstanceResponse200>> {
    return this.core.fetch('/reports/scheduled-reports/{scheduledReportId}/runs/latest', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of recipients for a specific instance of a given
   * scheduled report by it's unique identifier.   If the scheduled report requested is not
   * available the response will be a Not Found error. The instance of the report should be a
   * valid instance of the scheduled report. If the scheduled report doesn't have any
   * recipient the response will be an Empty response.
   *
   * @summary Get a list of recipients for a specific instance of a Report Schedule Id
   * @throws FetchError<400, types.GetReportsRecipientsByInstanceIdResponse400> Bad Request
   * @throws FetchError<401, types.GetReportsRecipientsByInstanceIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetReportsRecipientsByInstanceIdResponse404> Requested resource does not exist.
   * @throws FetchError<416, types.GetReportsRecipientsByInstanceIdResponse416> The range of data requested from the resource is invalid
   */
  getReportsRecipientsByInstanceId(metadata: types.GetReportsRecipientsByInstanceIdMetadataParam): Promise<FetchResponse<200, types.GetReportsRecipientsByInstanceIdResponse200>> {
    return this.core.fetch('/reports/scheduled-reports/{scheduledReportId}/runs/{instanceRunId}/recipients', 'get', metadata);
  }

  /**
   * Use this endpoint to get a scheduled report recipient data of a given instance by it's
   * recipient unique identifier.   If the scheduled report requested is not available the
   * response will be a not found error.  If the instance of the scheduled report doesn't
   * exists, the response will be a Not Found error If the recipient of the scheduled report
   * doesn't exists, the response will be a Not Found error
   *
   * @summary Recipient of instance run by recipient Id
   * @throws FetchError<400, types.GetReportInstaceRecipientByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetReportInstaceRecipientByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetReportInstaceRecipientByIdResponse404> Requested resource does not exist.
   */
  getReportInstaceRecipientById(metadata: types.GetReportInstaceRecipientByIdMetadataParam): Promise<FetchResponse<200, types.GetReportInstaceRecipientByIdResponse200>> {
    return this.core.fetch('/reports/scheduled-reports/{scheduledReportId}/runs/{instanceRunId}/recipients/{recipientId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of supplements for the current location. StartIndex
   * starts at 0. Default PageSize is 25. Pagination parameters are optional. Supported
   * includes values: items, notations. <br /> <b> Example: <br />
   * api/v2/supplements?pageSize=25&pageStartIndex=0&includes=items,notations&jobId=e591bf22-9828-4144-bca8-42cbb8c6e2c0
   * </b>
   *
   * @summary Get all the supplements across the company.
   * @throws FetchError<400, types.GetFinancialsSupplementsForCompanyResponse400> Bad Request
   * @throws FetchError<401, types.GetFinancialsSupplementsForCompanyResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetFinancialsSupplementsForCompanyResponse416> The range of data requested from the resource is invalid
   */
  getFinancialsSupplementsForCompany(metadata?: types.GetFinancialsSupplementsForCompanyMetadataParam): Promise<FetchResponse<200, types.GetFinancialsSupplementsForCompanyResponse200>> {
    return this.core.fetch('/supplements', 'get', metadata);
  }

  /**
   * Use this endpoint to get a particular supplement for the current location.
   *
   * @summary Get supplement by the given ID.
   * @throws FetchError<400, types.GetSupplementByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetSupplementByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetSupplementByIdResponse404> The range of data requested from the resource is invalid
   */
  getSupplementById(metadata: types.GetSupplementByIdMetadataParam): Promise<FetchResponse<200, types.GetSupplementByIdResponse200>> {
    return this.core.fetch('/supplements/{supplementId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of items for a specific supplement in the current
   * location. StartIndex starts at 0. The default PageSize is 25. Pagination parameters are
   * optional. <br /> <b> Example: <br />
   * api/v2/supplements/{supplementId}/items?pageSize=25&pageStartIndex=0 </b>
   *
   * @summary Get all the items for a specific supplement.
   * @throws FetchError<400, types.GetFinancialsSupplementItemCollectionResponse400> Bad Request
   * @throws FetchError<401, types.GetFinancialsSupplementItemCollectionResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetFinancialsSupplementItemCollectionResponse416> The range of data requested from the resource is invalid
   */
  getFinancialsSupplementItemCollection(metadata: types.GetFinancialsSupplementItemCollectionMetadataParam): Promise<FetchResponse<200, types.GetFinancialsSupplementItemCollectionResponse200>> {
    return this.core.fetch('/supplements/{supplementId}/items', 'get', metadata);
  }

  /**
   * Use this endpoint to get a list of notations for a specific supplement in the current
   * location. StartIndex starts at 0. The default PageSize is 25. Pagination parameters are
   * optional. <br /> <b> Example: <br />
   * api/v2/supplements/{supplementId}/notations?pageSize=25&pageStartIndex=0 </b>
   *
   * @summary Get all the notations for a specific supplement.
   * @throws FetchError<400, types.GetFinancialsSupplementNotationCollectionResponse400> Bad Request
   * @throws FetchError<401, types.GetFinancialsSupplementNotationCollectionResponse401> API Key is invalid or deactivated
   * @throws FetchError<416, types.GetFinancialsSupplementNotationCollectionResponse416> The range of data requested from the resource is invalid
   */
  getFinancialsSupplementNotationCollection(metadata: types.GetFinancialsSupplementNotationCollectionMetadataParam): Promise<FetchResponse<200, types.GetFinancialsSupplementNotationCollectionResponse200>> {
    return this.core.fetch('/supplements/{supplementId}/notations', 'get', metadata);
  }

  /**
   * Use this endpoint to get a specific Invoice.
   *
   * @summary Get Invoice
   * @throws FetchError<400, types.GetInvoiceByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetInvoiceByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetInvoiceByIdResponse404> Requested resource does not exist.
   */
  getInvoiceById(metadata: types.GetInvoiceByIdMetadataParam): Promise<FetchResponse<200, types.GetInvoiceByIdResponse200>> {
    return this.core.fetch('/invoices/{invoiceId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get the Financials for the specified financialID.  <br/>Supported
   * includes value: worksheet, amendments.
   *
   * @summary Get Financials
   * @throws FetchError<400, types.GetFinancialsByFinancialIdResponse400> Bad Request
   * @throws FetchError<401, types.GetFinancialsByFinancialIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetFinancialsByFinancialIdResponse404> Requested resource does not exist.
   */
  getFinancialsByFinancialId(metadata: types.GetFinancialsByFinancialIdMetadataParam): Promise<FetchResponse<200, types.GetFinancialsByFinancialIdResponse200>> {
    return this.core.fetch('/financials/{financialsId}', 'get', metadata);
  }

  /**
   * Use this endpoint to get a specific Worksheet by financialId.
   *
   * @summary Get Worksheet
   * @throws FetchError<400, types.GetWorksheetByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetWorksheetByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetWorksheetByIdResponse404> Requested resource does not exist.
   */
  getWorksheetById(metadata: types.GetWorksheetByIdMetadataParam): Promise<FetchResponse<200, types.GetWorksheetByIdResponse200>> {
    return this.core.fetch('/financials/{financialsId}/worksheet', 'get', metadata);
  }

  /**
   * Creates a new item in a worksheet using its financial ID. If the worksheet does not
   * exist, it will be created, and the sectionId parameter should be left empty. If the
   * worksheet already exists, you must provide the sectionId parameter, which should be a
   * valid section ID within the worksheet.
   *
   * @summary Create Worksheet Item
   * @throws FetchError<400, types.PostWorksheetSectionItemResponse400> Bad Request
   * @throws FetchError<401, types.PostWorksheetSectionItemResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.PostWorksheetSectionItemResponse404> Requested resource does not exist.
   */
  postWorksheetSectionItem(body: types.PostWorksheetSectionItemBodyParam, metadata: types.PostWorksheetSectionItemMetadataParam): Promise<FetchResponse<201, types.PostWorksheetSectionItemResponse201>> {
    return this.core.fetch('/financials/{financialsId}/worksheet/items', 'post', body, metadata);
  }

  /**
   * Use this endpoint to get a specific Financial's Amendments.
   *
   * @summary Get Financial Amendments
   * @throws FetchError<400, types.GetWorksheetAmendmentsByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetWorksheetAmendmentsByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetWorksheetAmendmentsByIdResponse404> Requested resource does not exist.
   * @throws FetchError<416, types.GetWorksheetAmendmentsByIdResponse416> The range of data requested from the resource is invalid
   */
  getWorksheetAmendmentsById(metadata: types.GetWorksheetAmendmentsByIdMetadataParam): Promise<FetchResponse<200, types.GetWorksheetAmendmentsByIdResponse200>> {
    return this.core.fetch('/financials/{financialsId}/amendments', 'get', metadata);
  }

  /**
   * Use this endpoint to get a specific Amendment.
   *
   * @summary Get Financial Amendment
   * @throws FetchError<400, types.GetWorksheetAmendmentByIdResponse400> Bad Request
   * @throws FetchError<401, types.GetWorksheetAmendmentByIdResponse401> API Key is invalid or deactivated
   * @throws FetchError<404, types.GetWorksheetAmendmentByIdResponse404> Requested resource does not exist.
   */
  getWorksheetAmendmentById(metadata: types.GetWorksheetAmendmentByIdMetadataParam): Promise<FetchResponse<200, types.GetWorksheetAmendmentByIdResponse200>> {
    return this.core.fetch('/financials/{financialsId}/amendments/{financialsAmendmentId}', 'get', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { DeleteArOwnerFromJobMetadataParam, DeleteArOwnerFromJobResponse401, DeleteArOwnerFromJobResponse404, DeleteSalesOwnerFromJobMetadataParam, DeleteSalesOwnerFromJobResponse401, DeleteSalesOwnerFromJobResponse404, GetAccountTypeByIdMetadataParam, GetAccountTypeByIdResponse200, GetAccountTypeByIdResponse400, GetAccountTypeByIdResponse401, GetAccountTypeByIdResponse404, GetAccountingIntegrationsSyncChangesForJobMetadataParam, GetAccountingIntegrationsSyncChangesForJobResponse200, GetAccountingIntegrationsSyncChangesForJobResponse400, GetAccountingIntegrationsSyncChangesForJobResponse401, GetAccountingIntegrationsSyncChangesForJobResponse403, GetAccountingIntegrationsSyncChangesForJobResponse404, GetAccuLynxCountriesMetadataParam, GetAccuLynxCountriesResponse200, GetAccuLynxCountriesResponse401, GetAccuLynxCountryMetadataParam, GetAccuLynxCountryResponse200, GetAccuLynxCountryResponse400, GetAccuLynxCountryResponse401, GetAccuLynxCountryResponse404, GetAccuLynxStateMetadataParam, GetAccuLynxStateResponse200, GetAccuLynxStateResponse400, GetAccuLynxStateResponse401, GetAccuLynxStateResponse404, GetAccuLynxStatesMetadataParam, GetAccuLynxStatesResponse200, GetAccuLynxStatesResponse400, GetAccuLynxStatesResponse401, GetAccuLynxStatesResponse404, GetAcculynxUnitsOfMeasureResponse200, GetAcculynxUnitsOfMeasureResponse401, GetActiveAccountTypesResponse200, GetActiveAccountTypesResponse400, GetActiveAccountTypesResponse401, GetActiveAccountTypesResponse404, GetActiveLeadSourcesMetadataParam, GetActiveLeadSourcesResponse200, GetActiveLeadSourcesResponse400, GetActiveLeadSourcesResponse401, GetActiveLeadSourcesResponse416, GetAdjusterForJobMetadataParam, GetAdjusterForJobResponse200, GetAdjusterForJobResponse400, GetAdjusterForJobResponse401, GetAdjusterForJobResponse404, GetAdjusterForJobResponse412, GetAppointmentByIdMetadataParam, GetAppointmentByIdResponse200, GetAppointmentByIdResponse401, GetAppointmentByIdResponse404, GetAppointmentsMetadataParam, GetAppointmentsResponse200, GetArOwnerForJobMetadataParam, GetArOwnerForJobResponse200, GetArOwnerForJobResponse401, GetArOwnerForJobResponse404, GetCalendarsMetadataParam, GetCalendarsResponse200, GetCalendarsResponse400, GetCalendarsResponse401, GetCalendarsResponse416, GetCompanyDocumentFoldersMetadataParam, GetCompanyDocumentFoldersResponse200, GetCompanyDocumentFoldersResponse400, GetCompanyDocumentFoldersResponse401, GetCompanyDocumentFoldersResponse416, GetCompanyRepresentativeForJobMetadataParam, GetCompanyRepresentativeForJobResponse200, GetCompanyRepresentativeForJobResponse401, GetCompanyRepresentativeForJobResponse404, GetCompanySettingsCustomFieldsMetadataParam, GetCompanySettingsCustomFieldsResponse200, GetCompanySettingsCustomFieldsResponse400, GetCompanySettingsCustomFieldsResponse401, GetCompanySettingsCustomFieldsResponse403, GetCompanySettingsCustomFieldsResponse416, GetCompanySettingsJobSettingsJobCategoriesMetadataParam, GetCompanySettingsJobSettingsJobCategoriesResponse200, GetCompanySettingsJobSettingsJobCategoriesResponse401, GetCompanySettingsJobSettingsJobCategoriesResponse416, GetCompanySettingsJobSettingsTradeTypesMetadataParam, GetCompanySettingsJobSettingsTradeTypesResponse200, GetCompanySettingsJobSettingsTradeTypesResponse401, GetCompanySettingsJobSettingsTradeTypesResponse416, GetCompanySettingsJobSettingsWorkTypesMetadataParam, GetCompanySettingsJobSettingsWorkTypesResponse200, GetCompanySettingsJobSettingsWorkTypesResponse400, GetCompanySettingsJobSettingsWorkTypesResponse401, GetCompanySettingsJobSettingsWorkTypesResponse416, GetCompanySettingsLocationSettingsCountriesMetadataParam, GetCompanySettingsLocationSettingsCountriesResponse200, GetCompanySettingsLocationSettingsCountriesResponse400, GetCompanySettingsLocationSettingsCountriesResponse401, GetCompanySettingsLocationSettingsCountriesResponse416, GetCompanySettingsResponse200, GetCompanySettingsResponse401, GetContactCustomFieldByIdMetadataParam, GetContactCustomFieldByIdResponse200, GetContactCustomFieldByIdResponse400, GetContactCustomFieldByIdResponse401, GetContactCustomFieldByIdResponse403, GetContactCustomFieldByIdResponse404, GetContactCustomFieldByIdResponse412, GetContactCustomFieldsMetadataParam, GetContactCustomFieldsResponse200, GetContactCustomFieldsResponse400, GetContactCustomFieldsResponse401, GetContactCustomFieldsResponse403, GetContactCustomFieldsResponse404, GetContactEmailAddressByIdMetadataParam, GetContactEmailAddressByIdResponse200, GetContactEmailAddressByIdResponse400, GetContactEmailAddressByIdResponse401, GetContactEmailAddressByIdResponse404, GetContactEmailAddressesMetadataParam, GetContactEmailAddressesResponse200, GetContactEmailAddressesResponse400, GetContactEmailAddressesResponse401, GetContactEmailAddressesResponse404, GetContactMetadataParam, GetContactPhoneNumberByIdMetadataParam, GetContactPhoneNumberByIdResponse200, GetContactPhoneNumberByIdResponse400, GetContactPhoneNumberByIdResponse401, GetContactPhoneNumberByIdResponse404, GetContactPhoneNumberMetadataParam, GetContactPhoneNumberResponse200, GetContactPhoneNumberResponse400, GetContactPhoneNumberResponse401, GetContactPhoneNumberResponse404, GetContactResponse200, GetContactResponse400, GetContactResponse401, GetContactResponse404, GetContactTypesMetadataParam, GetContactTypesResponse200, GetContactTypesResponse401, GetContactTypesResponse416, GetContactsMetadataParam, GetContactsResponse200, GetContactsResponse400, GetContactsResponse401, GetContactsResponse416, GetCurrentJobMilestoneMetadataParam, GetCurrentJobMilestoneResponse200, GetCurrentJobMilestoneResponse400, GetCurrentJobMilestoneResponse401, GetCurrentJobMilestoneResponse403, GetCurrentJobMilestoneResponse404, GetCurrentJobMilestoneResponse412, GetEstimateByIdMetadataParam, GetEstimateByIdResponse200, GetEstimateByIdResponse400, GetEstimateByIdResponse401, GetEstimateByIdResponse404, GetEstimateSectionByIdMetadataParam, GetEstimateSectionByIdResponse200, GetEstimateSectionByIdResponse400, GetEstimateSectionByIdResponse401, GetEstimateSectionByIdResponse404, GetEstimateSectionItemMetadataParam, GetEstimateSectionItemResponse200, GetEstimateSectionItemResponse400, GetEstimateSectionItemResponse401, GetEstimateSectionItemResponse404, GetEstimateSectionItemsMetadataParam, GetEstimateSectionItemsResponse200, GetEstimateSectionItemsResponse400, GetEstimateSectionItemsResponse401, GetEstimateSectionItemsResponse404, GetEstimateSectionsMetadataParam, GetEstimateSectionsResponse200, GetEstimateSectionsResponse400, GetEstimateSectionsResponse401, GetEstimateSectionsResponse404, GetEstimatesForJobMetadataParam, GetEstimatesForJobResponse200, GetEstimatesForJobResponse400, GetEstimatesForJobResponse401, GetEstimatesForJobResponse404, GetEstimatesForJobResponse416, GetEstimatesMetadataParam, GetEstimatesResponse200, GetEstimatesResponse400, GetEstimatesResponse401, GetEstimatesResponse416, GetFinancialsByFinancialIdMetadataParam, GetFinancialsByFinancialIdResponse200, GetFinancialsByFinancialIdResponse400, GetFinancialsByFinancialIdResponse401, GetFinancialsByFinancialIdResponse404, GetFinancialsForJobMetadataParam, GetFinancialsForJobResponse200, GetFinancialsForJobResponse400, GetFinancialsForJobResponse401, GetFinancialsForJobResponse404, GetFinancialsSupplementItemCollectionMetadataParam, GetFinancialsSupplementItemCollectionResponse200, GetFinancialsSupplementItemCollectionResponse400, GetFinancialsSupplementItemCollectionResponse401, GetFinancialsSupplementItemCollectionResponse416, GetFinancialsSupplementNotationCollectionMetadataParam, GetFinancialsSupplementNotationCollectionResponse200, GetFinancialsSupplementNotationCollectionResponse400, GetFinancialsSupplementNotationCollectionResponse401, GetFinancialsSupplementNotationCollectionResponse416, GetFinancialsSupplementsForCompanyMetadataParam, GetFinancialsSupplementsForCompanyResponse200, GetFinancialsSupplementsForCompanyResponse400, GetFinancialsSupplementsForCompanyResponse401, GetFinancialsSupplementsForCompanyResponse416, GetInitialAppointmentForJobMetadataParam, GetInitialAppointmentForJobResponse200, GetInitialAppointmentForJobResponse401, GetInitialAppointmentForJobResponse404, GetInsuranceCompaniesMetadataParam, GetInsuranceCompaniesResponse200, GetInsuranceCompaniesResponse401, GetInsuranceCompaniesResponse416, GetInsuranceForJobMetadataParam, GetInsuranceForJobResponse200, GetInsuranceForJobResponse400, GetInsuranceForJobResponse401, GetInsuranceForJobResponse404, GetInsuranceForJobResponse412, GetInvoiceByIdMetadataParam, GetInvoiceByIdResponse200, GetInvoiceByIdResponse400, GetInvoiceByIdResponse401, GetInvoiceByIdResponse404, GetInvoicesForJobMetadataParam, GetInvoicesForJobResponse200, GetInvoicesForJobResponse400, GetInvoicesForJobResponse401, GetInvoicesForJobResponse404, GetInvoicesForJobResponse416, GetJobContactMetadataParam, GetJobContactResponse200, GetJobContactResponse400, GetJobContactResponse401, GetJobContactResponse404, GetJobContactsMetadataParam, GetJobContactsResponse200, GetJobContactsResponse400, GetJobContactsResponse401, GetJobContactsResponse404, GetJobCustomFieldByIdMetadataParam, GetJobCustomFieldByIdResponse200, GetJobCustomFieldByIdResponse400, GetJobCustomFieldByIdResponse401, GetJobCustomFieldByIdResponse403, GetJobCustomFieldByIdResponse404, GetJobCustomFieldByIdResponse412, GetJobCustomFieldsMetadataParam, GetJobCustomFieldsResponse200, GetJobCustomFieldsResponse400, GetJobCustomFieldsResponse401, GetJobCustomFieldsResponse403, GetJobCustomFieldsResponse404, GetJobExternalReferencesMetadataParam, GetJobExternalReferencesResponse200, GetJobExternalReferencesResponse400, GetJobExternalReferencesResponse401, GetJobExternalReferencesResponse404, GetJobHistoryMetadataParam, GetJobHistoryResponse200, GetJobHistoryResponse400, GetJobHistoryResponse401, GetJobHistoryResponse404, GetJobHistoryResponse416, GetJobMetadataParam, GetJobMilestoneByIdMetadataParam, GetJobMilestoneByIdResponse200, GetJobMilestoneByIdResponse400, GetJobMilestoneByIdResponse401, GetJobMilestoneByIdResponse403, GetJobMilestoneByIdResponse404, GetJobMilestoneByIdResponse412, GetJobResponse200, GetJobStatusByIdMetadataParam, GetJobStatusByIdResponse200, GetJobStatusByIdResponse400, GetJobStatusByIdResponse401, GetJobStatusByIdResponse403, GetJobStatusByIdResponse404, GetJobStatusByIdResponse412, GetJobsMetadataParam, GetJobsResponse200, GetJobsResponse400, GetJobsResponse401, GetJobsResponse416, GetLeadHistoryMetadataParam, GetLeadHistoryResponse200, GetLeadHistoryResponse401, GetLeadHistoryResponse404, GetLeadSourceByIdMetadataParam, GetLeadSourceByIdResponse200, GetLeadSourceByIdResponse400, GetLeadSourceByIdResponse401, GetLeadSourceByIdResponse404, GetLeadSourceChildByIdMetadataParam, GetLeadSourceChildByIdResponse200, GetLeadSourceChildByIdResponse400, GetLeadSourceChildByIdResponse401, GetLeadSourceChildByIdResponse404, GetMilestonesForJobMetadataParam, GetMilestonesForJobResponse200, GetMilestonesMetadataParam, GetMilestonesResponse200, GetMilestonesResponse400, GetMilestonesResponse401, GetMilestonesResponse403, GetMilestonesResponse404, GetMilestonesResponse412, GetPaymentsMetadataParam, GetPaymentsOverviewForJobMetadataParam, GetPaymentsOverviewForJobResponse200, GetPaymentsOverviewForJobResponse400, GetPaymentsOverviewForJobResponse401, GetPaymentsOverviewForJobResponse404, GetPaymentsResponse200, GetPaymentsResponse400, GetPaymentsResponse401, GetPaymentsResponse404, GetPhotoVideoTagsMetadataParam, GetPhotoVideoTagsResponse200, GetPhotoVideoTagsResponse400, GetPhotoVideoTagsResponse401, GetPhotoVideoTagsResponse416, GetPingResponse200, GetPingResponse400, GetReportByInstanceIdMetadataParam, GetReportByInstanceIdResponse200, GetReportByInstanceIdResponse400, GetReportByInstanceIdResponse401, GetReportByInstanceIdResponse404, GetReportInstaceRecipientByIdMetadataParam, GetReportInstaceRecipientByIdResponse200, GetReportInstaceRecipientByIdResponse400, GetReportInstaceRecipientByIdResponse401, GetReportInstaceRecipientByIdResponse404, GetReportLatestInstanceMetadataParam, GetReportLatestInstanceResponse200, GetReportLatestInstanceResponse400, GetReportLatestInstanceResponse401, GetReportLatestInstanceResponse404, GetReportsByInstanceInstanceRunsByScheduleIdMetadataParam, GetReportsByInstanceInstanceRunsByScheduleIdResponse200, GetReportsByInstanceInstanceRunsByScheduleIdResponse400, GetReportsByInstanceInstanceRunsByScheduleIdResponse401, GetReportsByInstanceInstanceRunsByScheduleIdResponse404, GetReportsByInstanceInstanceRunsByScheduleIdResponse416, GetReportsRecipientsByInstanceIdMetadataParam, GetReportsRecipientsByInstanceIdResponse200, GetReportsRecipientsByInstanceIdResponse400, GetReportsRecipientsByInstanceIdResponse401, GetReportsRecipientsByInstanceIdResponse404, GetReportsRecipientsByInstanceIdResponse416, GetRepresentativesForJobMetadataParam, GetRepresentativesForJobResponse200, GetRepresentativesForJobResponse400, GetRepresentativesForJobResponse401, GetRepresentativesForJobResponse404, GetRepresentativesForJobResponse416, GetSalesOwnerForJobMetadataParam, GetSalesOwnerForJobResponse200, GetSalesOwnerForJobResponse401, GetSalesOwnerForJobResponse404, GetStatusesForMilestoneMetadataParam, GetStatusesForMilestoneResponse200, GetStatusesForMilestoneResponse400, GetStatusesForMilestoneResponse401, GetStatusesForMilestoneResponse403, GetStatusesForMilestoneResponse404, GetStatusesForMilestoneResponse412, GetSupplementByIdMetadataParam, GetSupplementByIdResponse200, GetSupplementByIdResponse400, GetSupplementByIdResponse401, GetSupplementByIdResponse404, GetUserMetadataParam, GetUserResponse200, GetUserResponse400, GetUserResponse401, GetUserResponse404, GetUsersMetadataParam, GetUsersResponse200, GetUsersResponse400, GetUsersResponse401, GetUsersResponse416, GetWorksheetAmendmentByIdMetadataParam, GetWorksheetAmendmentByIdResponse200, GetWorksheetAmendmentByIdResponse400, GetWorksheetAmendmentByIdResponse401, GetWorksheetAmendmentByIdResponse404, GetWorksheetAmendmentsByIdMetadataParam, GetWorksheetAmendmentsByIdResponse200, GetWorksheetAmendmentsByIdResponse400, GetWorksheetAmendmentsByIdResponse401, GetWorksheetAmendmentsByIdResponse404, GetWorksheetAmendmentsByIdResponse416, GetWorksheetByIdMetadataParam, GetWorksheetByIdResponse200, GetWorksheetByIdResponse400, GetWorksheetByIdResponse401, GetWorksheetByIdResponse404, GetcompanySettingsLocationSettingsCountriesCountryIdStatesMetadataParam, GetcompanySettingsLocationSettingsCountriesCountryIdStatesResponse200, GetcompanySettingsLocationSettingsCountriesCountryIdStatesResponse400, GetcompanySettingsLocationSettingsCountriesCountryIdStatesResponse401, GetcompanySettingsLocationSettingsCountriesCountryIdStatesResponse404, GetcompanySettingsLocationSettingsCountriesCountryIdStatesResponse416, JobsSearchBodyParam, JobsSearchMetadataParam, JobsSearchResponse200, JobsSearchResponse400, JobsSearchResponse401, JobsSearchResponse416, PostAddJobDocumentBodyParam, PostAddJobDocumentMetadataParam, PostAddJobDocumentResponse400, PostAddJobDocumentResponse401, PostAddJobDocumentResponse404, PostArOwnerForJobBodyParam, PostArOwnerForJobMetadataParam, PostArOwnerForJobResponse401, PostArOwnerForJobResponse404, PostCompanyRepresentativeForJobBodyParam, PostCompanyRepresentativeForJobMetadataParam, PostCompanyRepresentativeForJobResponse401, PostCompanyRepresentativeForJobResponse404, PostContactLogBodyParam, PostContactLogMetadataParam, PostContactLogResponse400, PostContactLogResponse401, PostContactLogResponse404, PostContactPhoneNumberBodyParam, PostContactPhoneNumberMetadataParam, PostContactPhoneNumberResponse400, PostContactPhoneNumberResponse401, PostContactPhoneNumberResponse404, PostContactSearchBodyParam, PostContactSearchMetadataParam, PostContactSearchResponse200, PostContactSearchResponse400, PostContactSearchResponse401, PostContactSearchResponse416, PostContactsBodyParam, PostContactsResponse201, PostContactsResponse400, PostContactsResponse401, PostCreateJobExternalReferenceBodyParam, PostCreateJobExternalReferenceResponse201, PostCreateJobExternalReferenceResponse400, PostCreateJobExternalReferenceResponse401, PostCreateJobExternalReferenceResponse404, PostCreateJobMessageBodyParam, PostCreateJobMessageMetadataParam, PostCreateJobMessageResponse201, PostCreateJobMessageResponse400, PostCreateJobMessageResponse401, PostCreateJobMessageResponse404, PostCreatePaymentAdditionalExpenseBodyParam, PostCreatePaymentAdditionalExpenseMetadataParam, PostCreatePaymentAdditionalExpenseResponse201, PostCreatePaymentAdditionalExpenseResponse400, PostCreatePaymentAdditionalExpenseResponse401, PostCreatePaymentAdditionalExpenseResponse404, PostCreatePaymentAdditionalExpenseResponse412, PostCreatePaymentPaidBodyParam, PostCreatePaymentPaidMetadataParam, PostCreatePaymentPaidResponse201, PostCreatePaymentPaidResponse400, PostCreatePaymentPaidResponse401, PostCreatePaymentPaidResponse404, PostCreatePaymentReceivedBodyParam, PostCreatePaymentReceivedMetadataParam, PostCreatePaymentReceivedResponse201, PostCreatePaymentReceivedResponse400, PostCreatePaymentReceivedResponse401, PostCreatePaymentReceivedResponse404, PostJobMeasurementsUploadBodyParam, PostJobMeasurementsUploadFilesBodyParam, PostJobMeasurementsUploadFilesMetadataParam, PostJobMeasurementsUploadFilesResponse202, PostJobMeasurementsUploadFilesResponse400, PostJobMeasurementsUploadFilesResponse401, PostJobMeasurementsUploadFilesResponse404, PostJobMeasurementsUploadFilesResponse412, PostJobMeasurementsUploadFilesResponse416, PostJobMeasurementsUploadMetadataParam, PostJobMeasurementsUploadResponse202, PostJobMeasurementsUploadResponse400, PostJobMeasurementsUploadResponse401, PostJobMeasurementsUploadResponse404, PostReplyJobMessageBodyParam, PostReplyJobMessageMetadataParam, PostReplyJobMessageResponse201, PostReplyJobMessageResponse400, PostReplyJobMessageResponse401, PostReplyJobMessageResponse404, PostSalesOwnerForJobBodyParam, PostSalesOwnerForJobMetadataParam, PostSalesOwnerForJobResponse401, PostSalesOwnerForJobResponse404, PostUploadPhotoOrVideoBodyParam, PostUploadPhotoOrVideoMetadataParam, PostUploadPhotoOrVideoResponse400, PostUploadPhotoOrVideoResponse401, PostUploadPhotoOrVideoResponse404, PostWorksheetSectionItemBodyParam, PostWorksheetSectionItemMetadataParam, PostWorksheetSectionItemResponse201, PostWorksheetSectionItemResponse400, PostWorksheetSectionItemResponse401, PostWorksheetSectionItemResponse404, PostjobBodyParam, PostjobResponse201, PostjobResponse400, PostjobResponse401, PostjobResponse403, PostjobResponse404, PutContactCustomFieldByIdBodyParam, PutContactCustomFieldByIdMetadataParam, PutContactCustomFieldByIdResponse400, PutContactCustomFieldByIdResponse401, PutContactCustomFieldByIdResponse404, PutContactCustomFieldsBodyParam, PutContactCustomFieldsMetadataParam, PutContactCustomFieldsResponse400, PutContactCustomFieldsResponse401, PutContactCustomFieldsResponse404, PutContactCustomFieldsResponse416, PutInitialAppointmentForJobBodyParam, PutInitialAppointmentForJobMetadataParam, PutInitialAppointmentForJobResponse400, PutInitialAppointmentForJobResponse401, PutInitialAppointmentForJobResponse404, PutInitialAppointmentForJobResponse412, PutInsuranceCompanyForJobBodyParam, PutInsuranceCompanyForJobMetadataParam, PutInsuranceCompanyForJobResponse400, PutInsuranceCompanyForJobResponse401, PutInsuranceCompanyForJobResponse404, PutInsuranceCompanyForJobResponse412, PutJobCustomFieldByIdBodyParam, PutJobCustomFieldByIdMetadataParam, PutJobCustomFieldByIdResponse400, PutJobCustomFieldByIdResponse401, PutJobCustomFieldByIdResponse404, PutJobCustomFieldsBodyParam, PutJobCustomFieldsMetadataParam, PutJobCustomFieldsResponse400, PutJobCustomFieldsResponse401, PutJobCustomFieldsResponse404, PutJobCustomFieldsResponse416 } from './types';
