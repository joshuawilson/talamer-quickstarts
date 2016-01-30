FROM jboss/wildfly

MAINTAINER "Joshua Wilson" <josh@redhat.com>

ENV USERNAME admin
ENV PASSWORD docker#admin

#Create admin user
RUN /opt/jboss/wildfly/bin/add-user.sh -u $USERNAME -p $PASSWORD --silent

# Add customization folder
COPY customization /opt/jboss/wildfly/customization/

USER root

# Run customization scripts as root
RUN chmod +x /opt/jboss/wildfly/customization/execute.sh
RUN /opt/jboss/wildfly/customization/execute.sh standalone

ADD /target/jboss-contacts-postgres.war /opt/jboss/wildfly/standalone/deployments/

# Fix for Error: Could not rename /opt/jboss/wildfly/standalone/configuration/standalone_xml_history/current
RUN rm -rf /opt/jboss/wildfly/standalone/configuration/standalone_xml_history

RUN chown -R jboss:jboss /opt/jboss/wildfly/

USER jboss

# Expose the ports we're interested in
EXPOSE 8080 9990 8009

# Set the default command to run on boot
# This will boot WildFly in the standalone mode and bind to external interface
CMD /opt/jboss/wildfly/bin/standalone.sh -b `hostname -i` -bmanagement `hostname -i`


