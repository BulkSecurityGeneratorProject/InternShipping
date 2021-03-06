package rs.eestec.internshipping.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.springframework.security.core.Authentication;
import rs.eestec.internshipping.domain.Company;
import rs.eestec.internshipping.domain.Resume;
import rs.eestec.internshipping.domain.User;
import rs.eestec.internshipping.security.SecurityUtils;
import rs.eestec.internshipping.service.CompanyService;
import rs.eestec.internshipping.service.UserService;
import rs.eestec.internshipping.web.rest.util.HeaderUtil;
import rs.eestec.internshipping.web.rest.util.PaginationUtil;
import rs.eestec.internshipping.web.rest.dto.CompanyDTO;
import rs.eestec.internshipping.web.rest.mapper.CompanyMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Company.
 */
@RestController
@RequestMapping("/api")
public class CompanyResource {

    private final Logger log = LoggerFactory.getLogger(CompanyResource.class);

    @Inject
    private UserService userService;

    @Inject
    private CompanyService companyService;

    @Inject
    private CompanyMapper companyMapper;

    /**
     * POST  /companies : Create a new company.
     *
     * @param companyDTO the companyDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new companyDTO, or with status 400 (Bad Request) if the company has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/companies",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CompanyDTO> createCompany(@Valid @RequestBody CompanyDTO companyDTO) throws URISyntaxException {
        log.debug("REST request to save Company : {}", companyDTO);
        if (companyDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("company", "idexists", "A new company cannot already have an ID")).body(null);
        }

        /* CurrentUser */
        companyDTO.setUserLogin(SecurityUtils.getCurrentUserLogin());
        Optional<User> activeUser = userService.getUserWithAuthoritiesByLogin(SecurityUtils.getCurrentUserLogin());
        companyDTO.setUserId( activeUser.get().getId() );

        CompanyDTO result = companyService.save(companyDTO);
        return ResponseEntity.created(new URI("/api/companies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("company", result.getId().toString()))
            .body(result);
    }



    /**
     * PUT  /companies : Updates an existing company.
     *
     * @param companyDTO the companyDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated companyDTO,
     * or with status 400 (Bad Request) if the companyDTO is not valid,
     * or with status 500 (Internal Server Error) if the companyDTO couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/companies",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CompanyDTO> updateCompany(@Valid @RequestBody CompanyDTO companyDTO) throws URISyntaxException {
        log.debug("REST request to update Company : {}", companyDTO);
        if (companyDTO.getId() == null) {
            return createCompany(companyDTO);
        }
        CompanyDTO result = companyService.save(companyDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("company", companyDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /companies : get all the companies.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of companies in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/companies",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<CompanyDTO>> getAllCompanies(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Companies");
        Page<Company> page = companyService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/companies");
        return new ResponseEntity<>(companyMapper.companiesToCompanyDTOs(page.getContent()), headers, HttpStatus.OK);
    }


    /**
     * GET  /companies : get all the companies.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of companies in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/ourcompany",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<CompanyDTO>> getOurCompany(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Our Company");
        log.info("STEFAN TEST");
        Page<Company> page = companyService.findCurrentUserCompany(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/companies");
        return new ResponseEntity<>(companyMapper.companiesToCompanyDTOs(page.getContent()), headers, HttpStatus.OK);
    }


    /**
     * GET  /companies/:id : get the "id" company.
     *
     * @param id the id of the companyDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the companyDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/companies/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CompanyDTO> getCompany(@PathVariable Long id) {
        log.debug("REST request to get Company : {}", id);
        CompanyDTO companyDTO = companyService.findOne(id);
        return Optional.ofNullable(companyDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /companies/:id : delete the "id" company.
     *
     * @param id the id of the companyDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/companies/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        log.debug("REST request to delete Company : {}", id);
        companyService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("company", id.toString())).build();
    }

    /**
     * SEARCH  /_search/companies?query=:query : search for the company corresponding
     * to the query.
     *
     * @param query the query of the company search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/companies",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<CompanyDTO>> searchCompanies(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Companies for query {}", query);
        Page<Company> page = companyService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/companies");
        return new ResponseEntity<>(companyMapper.companiesToCompanyDTOs(page.getContent()), headers, HttpStatus.OK);
    }


}
