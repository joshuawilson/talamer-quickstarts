package org.jboss.quickstarts.contact;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Contact.class)
public abstract class Contact_ {

	public static volatile SingularAttribute<Contact, Long> id;
	public static volatile SingularAttribute<Contact, String> lastName;
	public static volatile SingularAttribute<Contact, String> phoneNumber;
	public static volatile SingularAttribute<Contact, String> email;
	public static volatile SingularAttribute<Contact, Date> birthDate;
	public static volatile SingularAttribute<Contact, String> firstName;

}

