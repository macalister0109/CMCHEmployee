ALTER TABLE `empresas` 
ADD COLUMN IF NOT EXISTS `correo_empresa` VARCHAR(100) NULL 
COMMENT 'Correo principal de la empresa'
AFTER `correo_contacto`;