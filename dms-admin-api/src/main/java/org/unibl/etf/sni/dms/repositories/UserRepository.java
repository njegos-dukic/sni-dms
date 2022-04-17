package org.unibl.etf.sni.dms.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.unibl.etf.sni.dms.models.entities.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {

}
