package org.unibl.etf.sni.dms.models.entities;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "users")
@Getter
@Setter
@ToString
public class UserEntity {

    @Id
    @Column(name = "username", nullable = false, length = 128)
    private String id;

    @Column(name = "root_dir", nullable = false, length = 2048)
    private String rootDir;

    @Column(name = "can_read", nullable = false)
    private Boolean canRead = false;

    @Column(name = "can_update", nullable = false)
    private Boolean canUpdate = false;

    @Column(name = "can_delete", nullable = false)
    private Boolean canDelete = false;

    @Column(name = "can_create", nullable = false)
    private Boolean canCreate = false;

    @Column(name = "allowed_domain", length = 15)
    private String allowedDomain;
}