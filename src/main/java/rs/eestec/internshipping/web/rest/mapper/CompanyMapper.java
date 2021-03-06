package rs.eestec.internshipping.web.rest.mapper;

import rs.eestec.internshipping.domain.*;
import rs.eestec.internshipping.web.rest.dto.CompanyDTO;

import org.mapstruct.*;
import java.util.List;
import java.util.Set;

/**
 * Mapper for the entity Company and its DTO CompanyDTO.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class, JobMapper.class})

public interface CompanyMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.login", target = "userLogin")
    @Mapping(source = "company.jobs", target = "jobs")
    CompanyDTO companyToCompanyDTO(Company company);

    List<Job> jobSetToJobList(Set<Job> jobs);

    List<CompanyDTO> companiesToCompanyDTOs(List<Company> companies);

    @Mapping(source = "userId", target = "user")
    @Mapping(target = "jobs", ignore = true)
    Company companyDTOToCompany(CompanyDTO companyDTO);

    List<Company> companyDTOsToCompanies(List<CompanyDTO> companyDTOs);
}
